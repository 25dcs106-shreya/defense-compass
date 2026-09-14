import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/defcon/AppShell";
import { Bar, Metric, PageHeader, Panel, SeverityTag, Tag, riskTone } from "@/components/defcon/ui-bits";
import { Button } from "@/components/ui/button";
import { getIncident, RAW_ALERTS, THREAT_ACTORS } from "@/lib/defcon/data";
import { mitreFor } from "@/lib/defcon/engine";
import { useDefcon } from "@/lib/defcon/store";

export const Route = createFileRoute("/incidents/$incidentId")({
  loader: ({ params }) => {
    if (!getIncident(params.incidentId)) throw notFound();
    return null;
  },
  head: ({ params }) => ({
    meta: [
      { title: `Incident ${params.incidentId} — DEFCON-X` },
      { name: "description", content: `Correlated alerts, attack chain and mission impact for incident ${params.incidentId}.` },
      { property: "og:title", content: `Incident ${params.incidentId} — DEFCON-X` },
      { property: "og:description", content: `Correlated alerts, ATT&CK mapping and containment options for ${params.incidentId}.` },
    ],
  }),
  component: IncidentDetail,
});

const chainTone: Record<string, string> = {
  confirmed: "border-crit/50 bg-crit/10 text-crit",
  suspected: "border-medium/50 bg-medium/10 text-medium",
  none: "border-border bg-muted/40 text-muted-foreground",
};

function IncidentDetail() {
  const { incidentId } = Route.useParams();
  const { incidents, assets, setState, state, pushFeed } = useDefcon();
  const inc = incidents.find((i) => i.id === incidentId) ?? getIncident(incidentId)!;
  const asset = assets.find((a) => a.id === inc.assetId);
  const alerts = RAW_ALERTS.filter((a) => inc.alertIds.includes(a.id));
  const mitre = mitreFor(inc);
  const actor = THREAT_ACTORS.find((t) => t.name === inc.actor);
  const contained = state.contained.includes(inc.id);

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Incident · ${inc.assetId}`}
        title={`${inc.id} — ${inc.title}`}
        description={`${inc.alertIds.length} raw alerts correlated into one incident. Confidence ${inc.confidence}%.`}
        actions={
          <div className="flex items-center gap-2">
            <SeverityTag severity={inc.severity} />
            <Button
              size="sm"
              variant={contained ? "outline" : "default"}
              className="gap-2"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  contained: contained ? s.contained.filter((x) => x !== inc.id) : [...s.contained, inc.id],
                }));
                pushFeed({
                  severity: contained ? "MEDIUM" : "INFO",
                  source: "Operator",
                  message: contained ? `${inc.id} containment reverted` : `${inc.id} marked contained after approval`,
                });
              }}
            >
              <ShieldCheck className="h-4 w-4" />
              {contained ? "Revert containment" : "Approve containment"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Metric label="Threat Score" value={inc.threatScore} tone={riskTone(inc.threatScore)} />
        <Metric label="Confidence" value={inc.confidence} unit="%" />
        <Metric label="Status" value={inc.status} tone={inc.status === "OPEN" ? "crit" : "ok"} />
        <Metric label="Asset Mission Risk" value={asset?.missionRisk ?? 0} tone={riskTone(asset?.missionRisk ?? 0)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Why these alerts were correlated" subtitle="Explainable grouping rules">
          <ul className="space-y-2 text-sm">
            {inc.correlationBasis.map((b) => (
              <li key={b} className="flex gap-2 text-muted-foreground">
                <span className="text-primary">•</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-md border border-border bg-background/40 p-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{a.ts}</span>
                  <span className="font-mono text-[11px]">{a.id}</span>
                  <SeverityTag severity={a.severity} />
                  <Tag>{a.technique}</Tag>
                </div>
                <p className="mt-2">{a.description}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {a.user} · {a.srcIp} → {a.dstIp} · {a.process}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Attack Chain" subtitle="Evidence-graded progression">
            <div className="space-y-2">
              {Object.entries(inc.chain).map(([stage, level]) => (
                <div key={stage} className="flex items-center justify-between gap-2">
                  <span className="text-xs">{stage}</span>
                  <Tag tone={chainTone[level]}>{level}</Tag>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="ATT&amp;CK Mapping" subtitle="Technique evidence and confidence">
            <div className="space-y-3">
              {mitre.map((m) => (
                <div key={m.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-primary">
                      {m.id} · {m.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{m.confidence}%</span>
                  </div>
                  <div className="mt-1">
                    <Bar value={m.confidence} tone="medium" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.tactic} — {m.evidence}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          {actor && (
            <Panel title="Attribution" subtitle="Low-certainty — analyst validation required">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-widest">{actor.name}</span>
                <SeverityTag severity={actor.level} />
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {actor.confidence}% confidence
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{actor.summary}</p>
              <Link to="/intel" className="mt-3 inline-block font-mono text-[11px] text-primary hover:underline">
                Open threat intelligence →
              </Link>
            </Panel>
          )}

          <Panel title="Recommended Actions" subtitle="Decision support — operator approval required">
            <ol className="space-y-2 text-xs text-muted-foreground">
              <li>1. Validate the {alerts[0]?.user ?? "affected"} account and force credential rotation.</li>
              <li>2. Review endpoint telemetry on {inc.assetId} for persistence artefacts.</li>
              <li>3. Inspect outbound sessions to flagged infrastructure and consider blocking.</li>
              <li>4. Assess lateral movement toward dependent assets, then escalate to the duty officer.</li>
            </ol>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
