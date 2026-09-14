import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { AppShell } from "@/components/defcon/AppShell";
import { Bar, Metric, PageHeader, Panel, SeverityTag, Tag, riskTone } from "@/components/defcon/ui-bits";
import { ALERT_FUNNEL, RAW_ALERTS } from "@/lib/defcon/data";
import { useDefcon } from "@/lib/defcon/store";

export const Route = createFileRoute("/incidents/")({
  head: () => ({
    meta: [
      { title: "Alert Correlation — DEFCON-X" },
      { name: "description", content: "Thousands of raw alerts deduplicated and correlated into a handful of explainable incidents." },
      { property: "og:title", content: "Alert Correlation — DEFCON-X" },
      { property: "og:description", content: "Raw alerts reduced to explainable, mission-weighted incidents." },
    ],
  }),
  component: IncidentsPage,
});

function IncidentsPage() {
  const { incidents } = useDefcon();
  const max = ALERT_FUNNEL[0].value;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Cyber Domain"
        title="Alert Correlation"
        description="Alert fatigue is the problem. DEFCON-X deduplicates, correlates by entity and time window, and adds mission context so operators see incidents, not noise."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Raw Alerts (24h)" value={ALERT_FUNNEL[0].value.toLocaleString()} />
        <Metric label="Correlated Incidents" value={incidents.length} tone="medium" />
        <Metric
          label="Noise Reduction"
          value={`${Math.round((1 - ALERT_FUNNEL[4].value / ALERT_FUNNEL[0].value) * 100)}%`}
          tone="ok"
          hint="Raw alerts to critical incidents"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Correlation Funnel" subtitle="Each stage is rule-explainable">
          <div className="space-y-4">
            {ALERT_FUNNEL.map((s, i) => (
              <div key={s.stage}>
                <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  <span>{s.stage}</span>
                  <span className="text-foreground">{s.value.toLocaleString()}</span>
                </div>
                <div className="mt-1">
                  <Bar value={(s.value / max) * 100} tone={i === 4 ? "crit" : i >= 3 ? "medium" : "ok"} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                {i < ALERT_FUNNEL.length - 1 && (
                  <ArrowDown className="mx-auto mt-2 h-3 w-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Correlated Incidents" subtitle="Mission-weighted priority" className="lg:col-span-2">
          <div className="space-y-3">
            {incidents.map((inc) => (
              <Link
                key={inc.id}
                to="/incidents/$incidentId"
                params={{ incidentId: inc.id }}
                className="block rounded-md border border-border bg-background/40 p-3 transition-colors hover:border-primary/50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold tracking-widest text-primary">{inc.id}</span>
                  <SeverityTag severity={inc.severity} />
                  <Tag>{inc.status}</Tag>
                  <Tag>{inc.assetId}</Tag>
                  <span className={`ml-auto font-mono text-[11px] text-${riskTone(inc.threatScore)}`}>
                    Threat {inc.threatScore} · Confidence {inc.confidence}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{inc.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {inc.alertIds.length} alerts correlated — {inc.correlationBasis.slice(0, 3).join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4" title="Raw Alert Stream" subtitle="Pre-correlation SIEM / EDR events">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              <tr>
                <th className="py-2">Time</th>
                <th>Alert</th>
                <th>Asset</th>
                <th>Account</th>
                <th>Technique</th>
                <th>Severity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {RAW_ALERTS.map((a) => (
                <tr key={a.id} className="border-t border-border/60">
                  <td className="py-2 font-mono text-[11px] text-muted-foreground">{a.ts}</td>
                  <td className="font-mono text-[11px]">{a.id}</td>
                  <td className="font-mono text-[11px]">{a.assetId}</td>
                  <td className="font-mono text-[11px] text-muted-foreground">{a.user}</td>
                  <td className="font-mono text-[11px] text-primary">{a.technique}</td>
                  <td>
                    <SeverityTag severity={a.severity} />
                  </td>
                  <td className="max-w-sm text-muted-foreground">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
