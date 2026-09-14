import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/defcon/AppShell";
import { Bar, Gauge, Metric, PageHeader, Panel, SeverityTag, Tag, riskTone } from "@/components/defcon/ui-bits";
import { Button } from "@/components/ui/button";
import { DEPENDENCIES, MISSION } from "@/lib/defcon/data";
import { useDefcon } from "@/lib/defcon/store";

export const Route = createFileRoute("/command")({
  head: () => ({
    meta: [
      { title: "Command Center — DEFCON-X" },
      { name: "description", content: "Unified mission readiness, priority queue and live event feed." },
      { property: "og:title", content: "Command Center — DEFCON-X" },
      { property: "og:description", content: "Unified mission readiness, priority queue and live event feed." },
    ],
  }),
  component: CommandPage,
});

function CommandPage() {
  const { readiness, priorities, feed, scenarioRunning, runScenario, scenarioLog, reset, assets } = useDefcon();

  const dims = [
    { label: "Physical Health", value: readiness.physical },
    { label: "Cyber Posture", value: readiness.cyber },
    { label: "Maintenance", value: readiness.maintenance },
    { label: "Availability", value: readiness.availability },
    { label: "Intelligence Risk", value: 100 - readiness.intelligenceRisk },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Mission ${MISSION.name} · ${MISSION.window}`}
        title="Command Center"
        description="One picture of readiness across physical, cyber, maintenance and intelligence domains. Scores are deterministic and explainable."
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={runScenario} disabled={scenarioRunning} className="gap-2">
              <Play className="h-4 w-4" /> {scenarioRunning ? "Running…" : "Run demo scenario"}
            </Button>
            <Button size="sm" variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Mission Readiness" subtitle="Weighted by asset criticality" className="lg:col-span-1">
          <div className="flex flex-col items-center gap-4">
            <Gauge value={readiness.overall} label={readiness.band} />
            <div className="w-full space-y-3">
              {dims.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                    <span>{d.label}</span>
                    <span>{d.value}</span>
                  </div>
                  <div className="mt-1">
                    <Bar value={d.value} tone={d.value >= 85 ? "ok" : d.value >= 70 ? "medium" : "crit"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          title="Top Priorities"
          subtitle="Ranked by mission-weighted risk — analyst confirmation required"
          className="lg:col-span-2"
        >
          <ol className="space-y-3">
            {priorities.map((p) => (
              <li key={`${p.assetId}-${p.problem}`} className="rounded-md border border-border bg-background/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-primary">#{p.rank}</span>
                  <span className="font-mono text-xs font-semibold tracking-widest">{p.assetName}</span>
                  <SeverityTag severity={p.impact} />
                  <Tag>{p.domain}</Tag>
                  <span className={`ml-auto font-mono text-[11px] text-${riskTone(p.score)}`}>{p.scoreLabel}</span>
                </div>
                <p className="mt-2 text-sm font-medium">{p.problem}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.reason}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-primary">Recommended · </span>
                  {p.action}
                </p>
                <div className="mt-2">
                  {p.domain === "CYBER" ? (
                    <Link
                      to="/incidents/$incidentId"
                      params={{ incidentId: p.link.split("/").pop()! }}
                      className="font-mono text-[11px] text-primary hover:underline"
                    >
                      Open incident →
                    </Link>
                  ) : (
                    <Link
                      to="/twin/$assetId"
                      params={{ assetId: p.assetId }}
                      className="font-mono text-[11px] text-primary hover:underline"
                    >
                      Open digital twin →
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <Metric label="Assets Tracked" value={assets.length} hint="Synthetic Falcon Shield inventory" />
        <Metric
          label="Critical Assets"
          value={assets.filter((a) => a.status === "CRITICAL").length}
          tone="crit"
          hint="Mission risk ≥ 81 or readiness < 65"
        />
        <Metric label="Open Priorities" value={priorities.length} tone="medium" hint="Cyber + physical combined" />
        <Metric label="Readiness Band" value={readiness.band} tone={readiness.band === "READY" ? "ok" : "medium"} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Live Event Feed" subtitle="Synthetic telemetry and detections" className="lg:col-span-2">
          <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {feed.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-2 text-xs">
                <span className="font-mono text-[10px] text-muted-foreground">{e.ts}</span>
                <SeverityTag severity={e.severity} />
                <span className="font-mono text-[11px] text-muted-foreground">{e.source}</span>
                <span className="min-w-0 flex-1">{e.message}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel title="Force Dependencies">
            <div className="space-y-3">
              {DEPENDENCIES.map((d) => {
                const pct = Math.round((d.ready / d.total) * 100);
                return (
                  <div key={d.group}>
                    <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                      <span>{d.group}</span>
                      <span>
                        {d.ready}/{d.total}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Bar value={pct} tone={pct >= 90 ? "ok" : pct >= 75 ? "medium" : "crit"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Scenario Narration" subtitle="Guided demo trace">
            {scenarioLog.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Run the demo scenario to watch a sensor anomaly and a cyber intrusion converge into one readiness
                picture.
              </p>
            ) : (
              <ol className="space-y-2">
                {scenarioLog.map((l, i) => (
                  <li key={i} className="flex gap-2 text-xs">
                    <span className="font-mono text-[10px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-muted-foreground">{l}</span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
