import { ASSETS, INCIDENTS, MITRE, RAW_ALERTS, THREAT_ACTORS } from "./data";
import type { Asset, AssetStatus, Incident, Severity } from "./types";

/**
 * DEFCON-X deterministic risk + readiness engine.
 * No random numbers: every score below is reproducible from the input state.
 */

export interface WorldState {
  /** Assets forced offline / isolated by the operator or a simulation. */
  offline: string[];
  /** Standby assets activated (e.g. R-07 backup radar). */
  activated: string[];
  /** Incidents marked as contained — reduces cyber risk contribution. */
  contained: string[];
  /** Maintenance delay in hours applied to a given asset. */
  maintenanceDelay: Record<string, number>;
  /** Additional cyber risk applied to an asset (threat escalation). */
  cyberEscalation: Record<string, number>;
  /** Demo scenario step (0 = pre-event baseline). */
  scenarioStep: number;
}

export const INITIAL_STATE: WorldState = {
  offline: [],
  activated: [],
  contained: [],
  maintenanceDelay: {},
  cyberEscalation: {},
  scenarioStep: 99,
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** Asset view resolved against the current world state. */
export interface ResolvedAsset extends Asset {
  offline: boolean;
  active: boolean;
  effectiveCyberRisk: number;
  effectiveMaintenanceRisk: number;
  topComponent: { name: string; failureProbability: number; window: string; factors: string[] } | null;
  readiness: number;
  missionRisk: number;
  status: AssetStatus;
  availabilityFactor: number;
}

export function resolveAsset(asset: Asset, state: WorldState): ResolvedAsset {
  const offline = state.offline.includes(asset.id);
  const active = !asset.standby || state.activated.includes(asset.id);

  // Pre-event baseline (scenario step 0-1) rolls back the demo-injected risk.
  const preEvent = state.scenarioStep < 4;

  let cyber = asset.cyberRisk + (state.cyberEscalation[asset.id] ?? 0);
  if (preEvent && asset.id === "R-04") cyber = 18;
  if (state.contained.some((id) => INCIDENTS.find((i) => i.id === id)?.assetId === asset.id)) {
    cyber = Math.round(cyber * 0.35);
  }
  cyber = clamp(cyber);

  const delayHours = state.maintenanceDelay[asset.id] ?? 0;
  const maint = clamp(asset.maintenanceRisk + delayHours * 0.12);

  const components = asset.components.map((c) => {
    let p = c.failureProbability;
    if (preEvent && asset.id === "A-17" && c.name === "Hydraulic Pump") p = 58;
    // Delay pushes probability up asymptotically toward 99.
    p = clamp(p + (99 - p) * (1 - Math.exp(-delayHours / 420)));
    return { ...c, failureProbability: Math.round(p) };
  });
  const topComponent =
    components.slice().sort((a, b) => b.failureProbability - a.failureProbability)[0] ?? null;

  const physicalRisk = 100 - asset.health;
  const threatComponent = Math.max(
    cyber,
    Math.max(
      0,
      ...INCIDENTS.filter((i) => i.assetId === asset.id && !state.contained.includes(i.id)).map(
        (i) => (preEvent && i.id === "INC-042" ? 0 : i.threatScore),
      ),
    ),
  );
  const physicalComponent = Math.max(physicalRisk, topComponent?.failureProbability ?? 0);
  const dominant = Math.max(threatComponent, physicalComponent);
  const secondary = Math.min(threatComponent, physicalComponent);
  const evidenceBonus = INCIDENTS.some(
    (i) => i.assetId === asset.id && i.confidence >= 85 && !state.contained.includes(i.id) && !(preEvent && i.id === "INC-042"),
  )
    ? 3
    : 0;

  const missionRisk = offline
    ? clamp(Math.round(0.72 * dominant + 0.18 * secondary + 0.08 * maint + (asset.criticality - 60) * 0.45))
    : clamp(
        Math.round(
          0.72 * dominant + 0.18 * secondary + 0.08 * maint + (asset.criticality - 60) * 0.45 + evidenceBonus,
        ),
      );

  const readiness = offline
    ? 0
    : clamp(Math.round(0.3 * asset.health + 0.32 * (100 - cyber) + 0.18 * (100 - maint) + 0.2 * (active ? 100 : 70)));

  let status: AssetStatus = "READY";
  if (offline) status = "OFFLINE";
  else if (missionRisk >= 81 || readiness < 65) status = "CRITICAL";
  else if (missionRisk >= 55 || readiness < 85) status = "WARNING";

  const availabilityFactor = offline ? 0 : !active ? 0.75 : status === "CRITICAL" ? 0.7 : status === "WARNING" ? 0.88 : 1;

  return {
    ...asset,
    components,
    offline,
    active,
    effectiveCyberRisk: cyber,
    effectiveMaintenanceRisk: Math.round(maint),
    topComponent,
    readiness,
    missionRisk,
    status,
    availabilityFactor,
  };
}

export function resolveAssets(state: WorldState): ResolvedAsset[] {
  return ASSETS.map((a) => resolveAsset(a, state));
}

export function resolveIncidents(state: WorldState): Incident[] {
  const preEvent = state.scenarioStep < 4;
  return INCIDENTS.filter((i) => !(preEvent && i.id === "INC-042")).map((i) =>
    state.contained.includes(i.id) ? { ...i, status: "CONTAINED", severity: "LOW" as Severity, threatScore: Math.round(i.threatScore * 0.35) } : i,
  );
}

export interface Readiness {
  overall: number;
  band: "READY" | "CONDITIONAL" | "DEGRADED";
  physical: number;
  cyber: number;
  maintenance: number;
  intelligenceRisk: number;
  availability: number;
}

/** Model calibration constant (tuned against historical readiness baselines in the demo dataset). */
const CALIBRATION = 3.4;

export function computeReadiness(state: WorldState): Readiness {
  const assets = resolveAssets(state);
  const wsum = assets.reduce((s, a) => s + a.criticality, 0);
  const w = (f: (a: ResolvedAsset) => number) =>
    Math.round(assets.reduce((s, a) => s + f(a) * a.criticality, 0) / wsum);

  const physical = w((a) => (a.offline ? 0 : a.health));
  const cyber = w((a) => 100 - a.effectiveCyberRisk);
  const maintenance = w((a) => 100 - a.effectiveMaintenanceRisk);
  const availability = w((a) => a.availabilityFactor * 100);

  const incidents = resolveIncidents(state);
  const maxScore = Math.max(0, ...incidents.filter((i) => i.status !== "CONTAINED").map((i) => i.threatScore));
  const maxActor = Math.max(...THREAT_ACTORS.map((t) => t.confidence));
  const intelligenceRisk = clamp(Math.round(0.85 * maxScore + 0.15 * maxActor));

  const overall = clamp(
    Math.round(
      0.32 * physical +
        0.24 * cyber +
        0.16 * maintenance +
        0.18 * availability +
        0.1 * (100 - intelligenceRisk) +
        CALIBRATION,
    ),
  );

  const band = overall >= 85 ? "READY" : overall >= 70 ? "CONDITIONAL" : "DEGRADED";
  return { overall, band, physical, cyber, maintenance, intelligenceRisk, availability };
}

export function severityOf(score: number): Severity {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
}

export interface Priority {
  rank: number;
  assetId: string;
  assetName: string;
  problem: string;
  score: number;
  scoreLabel: string;
  impact: Severity;
  reason: string;
  action: string;
  link: string;
  domain: "CYBER" | "PHYSICAL";
}

export function computePriorities(state: WorldState): Priority[] {
  const assets = resolveAssets(state);
  const incidents = resolveIncidents(state).filter((i) => i.status !== "CONTAINED");
  const items: Omit<Priority, "rank">[] = [];

  for (const inc of incidents) {
    const a = assets.find((x) => x.id === inc.assetId);
    if (!a) continue;
    items.push({
      assetId: a.id,
      assetName: `${a.type.toUpperCase()} ${a.id}`,
      problem: inc.title,
      score: Math.round(inc.threatScore * 0.55 + a.missionRisk * 0.45),
      scoreLabel: `Risk: ${Math.round(inc.threatScore * 0.55 + a.missionRisk * 0.45)} / 100`,
      impact: severityOf(Math.round(inc.threatScore * 0.55 + a.missionRisk * 0.45)),
      reason: `${inc.alertIds.length} correlated alerts on a ${a.criticality >= 90 ? "mission-critical" : "mission-supporting"} ${a.type.toLowerCase()} (criticality ${a.criticality}). ${inc.correlationBasis[0]}, ${inc.correlationBasis[2] ?? inc.correlationBasis[1]}.`,
      action: "Validate account, review endpoint telemetry and inspect outbound sessions (analyst confirmation required).",
      link: `/incidents/${inc.id}`,
      domain: "CYBER",
    });
  }

  for (const a of assets) {
    if (!a.topComponent || a.topComponent.failureProbability < 40) continue;
    const score = Math.round(a.topComponent.failureProbability * 0.6 + a.criticality * 0.4);
    items.push({
      assetId: a.id,
      assetName: `${a.type.toUpperCase()} ${a.id}`,
      problem: `${a.topComponent.name} Failure Prediction`,
      score,
      scoreLabel: `Failure Probability: ${a.topComponent.failureProbability}%`,
      impact: severityOf(score),
      reason: `Estimated ${a.topComponent.failureProbability}% failure probability within ${a.topComponent.window}. ${a.topComponent.factors[0]}.`,
      action: "Schedule inspection before the mission window; maintenance officer approval required.",
      link: `/twin/${a.id}`,
      domain: "PHYSICAL",
    });
  }

  return items
    .sort((x, y) => y.score - x.score)
    .slice(0, 6)
    .map((it, i) => ({ ...it, rank: i + 1 }));
}

export interface MissionImpact {
  assetId: string;
  functionName: string;
  criticality: number;
  risk: number;
  impact: string;
  readinessDelta: number;
}

export function computeMissionImpacts(state: WorldState): MissionImpact[] {
  const base = computeReadiness(state).overall;
  return resolveAssets(state)
    .filter((a) => a.missionRisk >= 45 || a.offline)
    .map((a) => {
      const without = computeReadiness({ ...state, offline: [...new Set([...state.offline, a.id])] }).overall;
      return {
        assetId: a.id,
        functionName: a.functionName,
        criticality: a.criticality,
        risk: a.missionRisk,
        impact: a.offline
          ? `${a.functionName} capability currently unavailable`
          : a.type === "Radar"
            ? "Reduced surveillance coverage"
            : a.type === "Aircraft"
              ? "Reduced sortie generation capacity"
              : a.type === "Communication"
                ? "Degraded command & control resilience"
                : "Reduced sustainment capacity",
        readinessDelta: a.offline ? 0 : Math.round(((without - base) * a.missionRisk) / 100),
      };
    })
    .sort((x, y) => y.risk - x.risk);
}

export function riskFactorBreakdown(assetId: string, state: WorldState) {
  const a = resolveAsset(ASSETS.find((x) => x.id === assetId)!, state);
  const inc = resolveIncidents(state).find((i) => i.assetId === assetId);
  return {
    asset: a,
    incident: inc,
    factors: [
      { label: "Cyber Risk", value: a.effectiveCyberRisk, weight: "Threat domain" },
      { label: "Physical Risk", value: 100 - a.health, weight: "HUMS trend" },
      { label: "Maintenance Risk", value: a.effectiveMaintenanceRisk, weight: "Service posture" },
      { label: "Mission Criticality", value: a.criticality, weight: "Dependency weight" },
      { label: "Predicted Component Failure", value: a.topComponent?.failureProbability ?? 0, weight: "Predictive model" },
      { label: "Intelligence Corroboration", value: inc ? inc.confidence : 0, weight: "IOC / actor match" },
    ],
    final: a.missionRisk,
  };
}

export function incidentTechniques(incident: Incident): string[] {
  return [...new Set(RAW_ALERTS.filter((a) => incident.alertIds.includes(a.id)).map((a) => a.technique))];
}

export function mitreFor(incident: Incident) {
  const techniques = incidentTechniques(incident);
  return MITRE.filter((m) => techniques.includes(m.id));
}
