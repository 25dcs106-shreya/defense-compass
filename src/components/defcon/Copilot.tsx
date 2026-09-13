import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Sparkles, X } from "lucide-react";
import { useDefcon } from "@/lib/defcon/store";
import { KB_DOCUMENTS, MISSION } from "@/lib/defcon/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "./ui-bits";

interface Msg {
  role: "user" | "copilot";
  text: string;
  sources?: string[];
  confidence?: number;
  link?: { to: string; label: string };
}

const SUGGESTIONS = [
  "What is our current mission readiness?",
  "What should I worry about right now?",
  "Why is Radar R-04 high risk?",
  "What happens if A-17 is grounded?",
  "Summarise incident INC-042",
];

export function CopilotPanel({ onClose }: { onClose?: () => void }) {
  const { readiness, assets, incidents, priorities, impacts } = useDefcon();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "copilot",
      text: `DEFCON-X copilot online. I read from the ${MISSION.name} readiness model, the correlated incident queue and the indexed knowledge base. Ask me about readiness, an asset, an incident, or a what-if.`,
      confidence: 100,
    },
  ]);

  const answer = useMemo(
    () =>
      (q: string): Msg => {
        const t = q.toLowerCase();
        const assetMatch = assets.find((a) => t.includes(a.id.toLowerCase()));
        const incMatch = incidents.find((i) => t.includes(i.id.toLowerCase()));

        if (incMatch) {
          return {
            role: "copilot",
            text: `${incMatch.id} — ${incMatch.title} on ${incMatch.assetId}. ${incMatch.alertIds.length} raw alerts were correlated on: ${incMatch.correlationBasis.slice(0, 3).join("; ")}. Threat score ${incMatch.threatScore}/100, correlation confidence ${incMatch.confidence}%. Recommended next step: validate the account, review endpoint telemetry and inspect outbound sessions. Analyst confirmation is required before any containment action.`,
            sources: ["Correlation Engine", "DOC-004 Incident Response SOP", "DOC-005 APT-X7 Tradecraft"],
            confidence: incMatch.confidence,
            link: { to: `/incidents/${incMatch.id}`, label: `Open ${incMatch.id}` },
          };
        }

        if (assetMatch) {
          const c = assetMatch.topComponent;
          return {
            role: "copilot",
            text: `${assetMatch.type} ${assetMatch.id} (${assetMatch.functionName}) is ${assetMatch.status}. Mission risk ${assetMatch.missionRisk}/100, readiness ${assetMatch.readiness}%. Physical health ${assetMatch.health}%, cyber risk ${assetMatch.effectiveCyberRisk}, maintenance risk ${assetMatch.effectiveMaintenanceRisk}.${c ? ` Highest predicted component failure: ${c.name} at ${c.failureProbability}% within ${c.window} — driven by ${c.factors[0].toLowerCase()}.` : ""} Mission criticality is ${assetMatch.criticality}/100.`,
            sources: ["Risk Engine", "HUMS Telemetry", ...KB_DOCUMENTS.filter((d) => d.assetId === assetMatch.id).map((d) => `${d.id} ${d.title}`)],
            confidence: 88,
            link: { to: `/twin/${assetMatch.id}`, label: `Open digital twin ${assetMatch.id}` },
          };
        }

        if (t.includes("readiness") || t.includes("posture") || t.includes("status")) {
          return {
            role: "copilot",
            text: `${MISSION.name} readiness is ${readiness.overall}% (${readiness.band}). Contributions: physical ${readiness.physical}%, cyber ${readiness.cyber}%, maintenance ${readiness.maintenance}%, availability ${readiness.availability}%, intelligence risk ${readiness.intelligenceRisk}/100. The largest single detractor is ${impacts[0]?.assetId ?? "n/a"} (${impacts[0]?.impact ?? "nominal"}).`,
            sources: ["Readiness Model", "Mission Impact Engine"],
            confidence: 92,
            link: { to: "/command", label: "Open command center" },
          };
        }

        if (t.includes("worry") || t.includes("priorit") || t.includes("first") || t.includes("now")) {
          const p = priorities.slice(0, 3);
          return {
            role: "copilot",
            text: `Top priorities right now:\n${p.map((x) => `${x.rank}. ${x.assetName} — ${x.problem} (${x.scoreLabel}). ${x.reason}`).join("\n")}\nAll actions require human confirmation.`,
            sources: ["Prioritisation Engine", "Correlation Engine", "Predictive Model"],
            confidence: 90,
            link: { to: "/command", label: "Open priority queue" },
          };
        }

        if (t.includes("what if") || t.includes("happens if") || t.includes("ground") || t.includes("offline")) {
          return {
            role: "copilot",
            text: `Use the simulator to model that. As a preview: removing the highest-risk asset from the mission changes readiness by roughly ${impacts[0]?.readinessDelta ?? 0} points and degrades "${impacts[0]?.functionName ?? "mission"}" capability. The simulator recalculates the full weighted model including standby substitution.`,
            sources: ["What-If Engine"],
            confidence: 84,
            link: { to: "/simulator", label: "Open what-if simulator" },
          };
        }

        if (t.includes("threat") || t.includes("actor") || t.includes("apt")) {
          return {
            role: "copilot",
            text: `Highest-confidence attribution is APT-X7 at 87% confidence, associated with R-04 and C-12 through valid-account abuse (T1078), encoded PowerShell (T1059.001), credential access (T1003) and web-protocol C2 (T1071.001). Attribution is probabilistic and modelled on synthetic data.`,
            sources: ["Threat Intelligence Feed", "DOC-005 APT-X7 Tradecraft"],
            confidence: 87,
            link: { to: "/intel", label: "Open threat intelligence" },
          };
        }

        return {
          role: "copilot",
          text: `I can answer from the readiness model, the incident queue, asset digital twins and the indexed knowledge base (${KB_DOCUMENTS.length} demo documents). Try asking about an asset ID (A-17, R-04, V-32), an incident ID (INC-042), overall readiness, or a what-if.`,
          sources: ["Knowledge Base Index"],
          confidence: 60,
        };
      },
    [assets, incidents, readiness, priorities, impacts],
  );

  const send = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }, answer(q)]);
    setInput("");
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }));
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold tracking-[0.18em] uppercase">
            DEFCON-X Copilot
          </span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close copilot">
            <X className="h-4 w-4" />
          </Button>
        )}
      </header>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "max-w-[95%] rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
              }
            >
              <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
              {m.sources && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.sources.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              )}
              {typeof m.confidence === "number" && m.role === "copilot" && (
                <p className="mt-2 font-mono text-[10px] tracking-wider text-muted-foreground">
                  CONFIDENCE {m.confidence}% · DECISION SUPPORT ONLY — HUMAN APPROVAL REQUIRED
                </p>
              )}
              {m.link && (
                <Link
                  to={m.link.to}
                  className="mt-2 inline-block font-mono text-[11px] text-primary underline underline-offset-4"
                >
                  {m.link.label} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the copilot…"
            className="font-mono text-xs"
          />
          <Button type="submit" size="icon" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
