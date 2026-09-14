import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/defcon/AppShell";
import { Bar, Metric, PageHeader, Panel, SeverityTag, Tag, riskTone } from "@/components/defcon/ui-bits";
import { severityOf } from "@/lib/defcon/engine";
import { useDefcon } from "@/lib/defcon/store";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Predictive Maintenance — DEFCON-X" },
      { name: "description", content: "Component failure predictions, service windows and overdue maintenance across the fleet." },
      { property: "og:title", content: "Predictive Maintenance — DEFCON-X" },
      { property: "og:description", content: "Component failure predictions and service windows across the fleet." },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const { assets } = useDefcon();
  const predictions = assets
    .flatMap((a) => a.components.map((c) => ({ asset: a, c })))
    .sort((x, y) => y.c.failureProbability - x.c.failureProbability);
  const overdue = assets.filter((a) => a.nextServiceDays <= 0);
  const highRisk = predictions.filter((p) => p.c.failureProbability >= 60);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Physical Domain"
        title="Predictive Maintenance"
        description="HUMS trend analysis converts sensor drift into component failure probability and a service window. Every recommendation needs maintenance officer approval."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Tracked Components" value={predictions.length} />
        <Metric label="High-Risk Predictions" value={highRisk.length} tone="crit" hint="Failure probability ≥ 60%" />
        <Metric label="Overdue Services" value={overdue.length} tone="medium" hint="Past scheduled service date" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Failure Predictions" subtitle="Ranked across the fleet" className="lg:col-span-2">
          <div className="space-y-3">
            {predictions.slice(0, 12).map(({ asset, c }) => (
              <div key={`${asset.id}-${c.name}`} className="rounded-md border border-border bg-background/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold tracking-widest">
                    {asset.type.toUpperCase()} {asset.id}
                  </span>
                  <SeverityTag severity={severityOf(c.failureProbability)} />
                  <span className={`ml-auto font-mono text-sm text-${riskTone(c.failureProbability)}`}>
                    {c.failureProbability}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{c.name}</p>
                <div className="mt-2">
                  <Bar value={c.failureProbability} tone={riskTone(c.failureProbability)} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Window {c.window} · {c.factors.join(" · ")}
                </p>
                <Link
                  to="/twin/$assetId"
                  params={{ assetId: asset.id }}
                  className="mt-2 inline-block font-mono text-[11px] text-primary hover:underline"
                >
                  Inspect digital twin →
                </Link>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Service Schedule" subtitle="Days to next scheduled service">
          <ul className="space-y-3">
            {assets
              .slice()
              .sort((a, b) => a.nextServiceDays - b.nextServiceDays)
              .map((a) => (
                <li key={a.id} className="border-b border-border/60 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs tracking-widest">
                      {a.type.toUpperCase()} {a.id}
                    </span>
                    <Tag tone={a.nextServiceDays <= 0 ? "border-crit/50 bg-crit/10 text-crit" : undefined}>
                      {a.nextServiceDays <= 0 ? `${Math.abs(a.nextServiceDays)}d overdue` : `${a.nextServiceDays}d`}
                    </Tag>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last service {a.lastServiceDays} days ago · maintenance risk {a.effectiveMaintenanceRisk}
                  </p>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
