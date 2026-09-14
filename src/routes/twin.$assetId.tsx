import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/defcon/AppShell";
import { Bar, Metric, PageHeader, Panel, StatusTag, Tag, riskTone } from "@/components/defcon/ui-bits";
import { getAsset } from "@/lib/defcon/data";
import { riskFactorBreakdown } from "@/lib/defcon/engine";
import { useDefcon } from "@/lib/defcon/store";

export const Route = createFileRoute("/twin/$assetId")({
  loader: ({ params }) => {
    if (!getAsset(params.assetId)) throw notFound();
    return null;
  },
  head: ({ params }) => ({
    meta: [
      { title: `Digital Twin ${params.assetId} — DEFCON-X` },
      { name: "description", content: `Sensor trends, component failure predictions and risk breakdown for asset ${params.assetId}.` },
      { property: "og:title", content: `Digital Twin ${params.assetId} — DEFCON-X` },
      { property: "og:description", content: `Sensor trends and predicted component failures for ${params.assetId}.` },
    ],
  }),
  component: TwinPage,
});

const axis = { stroke: "var(--muted-foreground)", fontSize: 10 };

function TwinPage() {
  const { assetId } = Route.useParams();
  const { state } = useDefcon();
  const { asset, incident, factors, final } = riskFactorBreakdown(assetId, state);

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${asset.type} · ${asset.location}`}
        title={`Digital Twin — ${asset.id}`}
        description={asset.name}
        actions={<StatusTag status={asset.status} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Health" value={asset.health} unit="%" tone={asset.health >= 85 ? "ok" : "medium"} />
        <Metric label="Mission Risk" value={final} tone={riskTone(final)} hint="Weighted risk fusion" />
        <Metric label="Operating Hours" value={asset.operatingHours.toLocaleString()} />
        <Metric
          label="Next Service"
          value={asset.nextServiceDays}
          unit="d"
          tone={asset.nextServiceDays <= 0 ? "crit" : "foreground"}
          hint={`Last serviced ${asset.lastServiceDays} days ago`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Vibration &amp; Temperature" subtitle="Last 24 hours of HUMS telemetry">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={asset.sensors}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="t" {...axis} interval={7} />
              <YAxis {...axis} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }}
              />
              <Line type="monotone" dataKey="vibration" stroke="var(--crit)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="temperature" stroke="var(--chart-2)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            Nominal vibration {asset.nominal.vibration[0]}–{asset.nominal.vibration[1]} mm/s · temperature{" "}
            {asset.nominal.temperature[0]}–{asset.nominal.temperature[1]} °C
          </p>
        </Panel>

        <Panel title="Pressure Trend" subtitle="Hydraulic / system pressure">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={asset.sensors}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="t" {...axis} interval={7} />
              <YAxis {...axis} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="pressure" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            Nominal {asset.nominal.pressure[0]}–{asset.nominal.pressure[1]}
          </p>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Predicted Component Failures" subtitle="Model output — inspection required before action">
          <div className="space-y-4">
            {asset.components.map((c) => (
              <div key={c.name} className="rounded-md border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{c.name}</p>
                  <span className={`font-mono text-sm text-${riskTone(c.failureProbability)}`}>
                    {c.failureProbability}%
                  </span>
                </div>
                <div className="mt-2">
                  <Bar value={c.failureProbability} tone={riskTone(c.failureProbability)} />
                </div>
                <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  Window: {c.window}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {c.factors.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Risk Factor Breakdown" subtitle="How the mission risk score is composed">
            <div className="space-y-3">
              {factors.map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                    <span>
                      {f.label} <span className="opacity-60">· {f.weight}</span>
                    </span>
                    <span>{f.value}</span>
                  </div>
                  <div className="mt-1">
                    <Bar value={f.value} tone={riskTone(f.value)} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Final mission risk <span className={`text-${riskTone(final)}`}>{final}/100</span>. Scores are
              deterministic: the same inputs always produce the same output.
            </p>
            {incident && (
              <Link
                to="/incidents/$incidentId"
                params={{ incidentId: incident.id }}
                className="mt-3 inline-block font-mono text-[11px] text-primary hover:underline"
              >
                Linked incident {incident.id} →
              </Link>
            )}
          </Panel>

          <Panel title="Service History">
            <ul className="space-y-3">
              {asset.serviceHistory.map((s) => (
                <li key={`${s.date}-${s.action}`} className="border-b border-border/60 pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag>{s.date}</Tag>
                    <span className="font-medium">{s.action}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {s.technician} — {s.notes}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
