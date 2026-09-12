import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_STATE, computeMissionImpacts, computePriorities, computeReadiness, resolveAssets, resolveIncidents, type WorldState } from "./engine";
import type { Role, Severity } from "./types";

export interface FeedEvent {
  id: string;
  ts: string;
  severity: Severity;
  source: string;
  message: string;
}

export interface Notification {
  id: string;
  severity: Severity;
  message: string;
  ts: string;
}

const SEED_FEED: FeedEvent[] = [
  { id: "e1", ts: "19:32:14", severity: "CRITICAL", source: "Radar R-04", message: "Suspicious authentication detected" },
  { id: "e2", ts: "19:31:48", severity: "MEDIUM", source: "Aircraft A-17", message: "Hydraulic pressure anomaly" },
  { id: "e3", ts: "19:30:51", severity: "HIGH", source: "Network Node C-12", message: "Suspicious outbound connection" },
  { id: "e4", ts: "19:29:20", severity: "INFO", source: "Threat Intelligence", message: "IOC match updated" },
  { id: "e5", ts: "19:27:03", severity: "MEDIUM", source: "Vehicle V-32", message: "Transmission shift-pressure variance" },
  { id: "e6", ts: "19:24:55", severity: "INFO", source: "Data Pipeline", message: "HUMS batch ingested — 4,102 readings" },
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", severity: "CRITICAL", message: "Radar R-04 mission risk increased to 91.", ts: "19:32" },
  { id: "n2", severity: "HIGH", message: "Aircraft A-17 predicted failure probability increased to 87%.", ts: "19:31" },
  { id: "n3", severity: "MEDIUM", message: "Maintenance overdue for V-32 (+4 days).", ts: "18:50" },
  { id: "n4", severity: "INFO", message: "Threat intelligence feed updated — 143 IOCs.", ts: "18:12" },
];

interface Ctx {
  state: WorldState;
  setState: (fn: (s: WorldState) => WorldState) => void;
  reset: () => void;
  role: Role;
  setRole: (r: Role) => void;
  authed: boolean;
  signIn: (r: Role) => void;
  signOut: () => void;
  demoMode: boolean;
  setDemoMode: (b: boolean) => void;
  liveSim: boolean;
  setLiveSim: (b: boolean) => void;
  feed: FeedEvent[];
  pushFeed: (e: Omit<FeedEvent, "id" | "ts">) => void;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  copilotOpen: boolean;
  setCopilotOpen: (b: boolean) => void;
  scenarioRunning: boolean;
  runScenario: () => void;
  scenarioLog: string[];
  readiness: ReturnType<typeof computeReadiness>;
  assets: ReturnType<typeof resolveAssets>;
  incidents: ReturnType<typeof resolveIncidents>;
  priorities: ReturnType<typeof computePriorities>;
  impacts: ReturnType<typeof computeMissionImpacts>;
}

const DefconContext = createContext<Ctx | null>(null);

function nowTs() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
}

const SCENARIO: { delay: number; log: string; apply?: (s: WorldState) => WorldState; feed?: Omit<FeedEvent, "id" | "ts"> }[] = [
  { delay: 0, log: "Baseline established — Falcon Shield readiness nominal.", apply: (s) => ({ ...s, scenarioStep: 0, contained: [], offline: [], activated: [], maintenanceDelay: {}, cyberEscalation: {} }) },
  { delay: 1600, log: "SIEM burst received on Radar R-04.", feed: { severity: "MEDIUM", source: "Radar R-04", message: "Failed authentication cluster (6 attempts)" } },
  { delay: 1500, log: "Alerts normalised and correlated → INC-042.", feed: { severity: "HIGH", source: "Correlation Engine", message: "5 alerts correlated into INC-042" } },
  { delay: 1500, log: "Threat intelligence IOC match confirmed (203.0.113.77).", feed: { severity: "HIGH", source: "Threat Intelligence", message: "IOC match — APT-X7 infrastructure" } },
  { delay: 1400, log: "Radar R-04 cyber risk elevated.", apply: (s) => ({ ...s, scenarioStep: 4 }), feed: { severity: "CRITICAL", source: "Radar R-04", message: "Potential credential compromise — risk 91" } },
  { delay: 1400, log: "HUMS anomaly detected on Aircraft A-17.", feed: { severity: "MEDIUM", source: "Aircraft A-17", message: "Vibration 4.7 mm/s — above nominal band" } },
  { delay: 1400, log: "Hydraulic pump failure probability estimated at 87%.", apply: (s) => ({ ...s, scenarioStep: 6 }), feed: { severity: "HIGH", source: "Predictive Engine", message: "A-17 hydraulic pump failure probability 87%" } },
  { delay: 1400, log: "Mission impact recalculated — readiness reduced.", feed: { severity: "INFO", source: "Mission Impact Engine", message: "Falcon Shield readiness updated" } },
  { delay: 1400, log: "Top priorities published to Command Center.", feed: { severity: "INFO", source: "DEFCON-X", message: "Priority queue re-ranked (2 critical)" } },
];

export function DefconProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<WorldState>(INITIAL_STATE);
  const [role, setRole] = useState<Role>("COMMANDER");
  const [authed, setAuthed] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [liveSim, setLiveSim] = useState(true);
  const [feed, setFeed] = useState<FeedEvent[]>(SEED_FEED);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [scenarioRunning, setScenarioRunning] = useState(false);
  const [scenarioLog, setScenarioLog] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const setState = useCallback((fn: (s: WorldState) => WorldState) => setStateRaw((s) => fn(s)), []);
  const reset = useCallback(() => setStateRaw(INITIAL_STATE), []);

  const pushFeed = useCallback((e: Omit<FeedEvent, "id" | "ts">) => {
    setFeed((f) => [{ ...e, id: `${Date.now()}-${Math.round(Math.random() * 1e5)}`, ts: nowTs() }, ...f].slice(0, 40));
  }, []);

  // Live simulation: low-frequency synthetic telemetry so the feed breathes.
  useEffect(() => {
    if (!liveSim) return;
    const pool: Omit<FeedEvent, "id" | "ts">[] = [
      { severity: "INFO", source: "Data Pipeline", message: "HUMS batch ingested — 1,204 readings" },
      { severity: "INFO", source: "Threat Intelligence", message: "Feed sync complete — 143 IOCs active" },
      { severity: "MEDIUM", source: "Vehicle V-32", message: "Transmission temperature drift under load" },
      { severity: "INFO", source: "Correlation Engine", message: "Deduplication pass complete" },
      { severity: "MEDIUM", source: "Aircraft A-17", message: "Hydraulic pressure below nominal band" },
      { severity: "HIGH", source: "Network Node C-12", message: "Outbound session to low-reputation host" },
    ];
    let i = 0;
    const t = setInterval(() => {
      pushFeed(pool[i % pool.length]);
      i++;
    }, 9000);
    return () => clearInterval(t);
  }, [liveSim, pushFeed]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runScenario = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setScenarioLog([]);
    setScenarioRunning(true);
    let acc = 0;
    SCENARIO.forEach((step, idx) => {
      acc += step.delay;
      timers.current.push(
        setTimeout(() => {
          if (step.apply) setStateRaw((s) => step.apply!(s));
          if (step.feed) pushFeed(step.feed);
          setScenarioLog((l) => [...l, step.log]);
          if (idx === SCENARIO.length - 1) setScenarioRunning(false);
        }, acc),
      );
    });
  }, [pushFeed]);

  const readiness = useMemo(() => computeReadiness(state), [state]);
  const assets = useMemo(() => resolveAssets(state), [state]);
  const incidents = useMemo(() => resolveIncidents(state), [state]);
  const priorities = useMemo(() => computePriorities(state), [state]);
  const impacts = useMemo(() => computeMissionImpacts(state), [state]);

  const value: Ctx = {
    state,
    setState,
    reset,
    role,
    setRole,
    authed,
    signIn: (r) => {
      setRole(r);
      setAuthed(true);
    },
    signOut: () => setAuthed(false),
    demoMode,
    setDemoMode,
    liveSim,
    setLiveSim,
    feed,
    pushFeed,
    notifications,
    dismissNotification: (id) => setNotifications((n) => n.filter((x) => x.id !== id)),
    copilotOpen,
    setCopilotOpen,
    scenarioRunning,
    runScenario,
    scenarioLog,
    readiness,
    assets,
    incidents,
    priorities,
    impacts,
  };

  return <DefconContext.Provider value={value}>{children}</DefconContext.Provider>;
}

export function useDefcon() {
  const ctx = useContext(DefconContext);
  if (!ctx) throw new Error("useDefcon must be used inside DefconProvider");
  return ctx;
}
