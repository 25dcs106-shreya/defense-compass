import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/defcon/AppShell";
import { Bar, PageHeader, Panel, StatusTag, Tag, riskTone } from "@/components/defcon/ui-bits";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDefcon } from "@/lib/defcon/store";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Asset Fleet — DEFCON-X" },
      { name: "description", content: "Health, cyber risk and mission risk for every tracked defence asset." },
      { property: "og:title", content: "Asset Fleet — DEFCON-X" },
      { property: "og:description", content: "Health, cyber risk and mission risk for every tracked defence asset." },
    ],
  }),
  component: FleetPage,
});

const FILTERS = ["ALL", "READY", "WARNING", "CRITICAL", "OFFLINE"] as const;

function FleetPage() {
  const { assets } = useDefcon();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const shown = assets.filter(
    (a) =>
      (filter === "ALL" || a.status === filter) &&
      `${a.id} ${a.name} ${a.type} ${a.location}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Fleet"
        title="Asset Fleet"
        description="Every asset resolved against live world state: physical health from HUMS trends, cyber risk from correlated detections, and mission risk weighted by criticality."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search assets…"
          className="max-w-xs"
        />
        {FILTERS.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            <span className="font-mono text-[10px] tracking-[0.16em]">{f}</span>
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((a) => (
          <Panel key={a.id} title={`${a.type} ${a.id}`} subtitle={a.location} right={<StatusTag status={a.status} />}>
            <p className="text-sm font-medium">{a.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{a.functionName}</p>

            <div className="mt-4 space-y-3">
              {[
                { label: "Health", value: a.health, good: true },
                { label: "Cyber Risk", value: a.effectiveCyberRisk, good: false },
                { label: "Maintenance Risk", value: a.effectiveMaintenanceRisk, good: false },
                { label: "Mission Risk", value: a.missionRisk, good: false },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                    <span>{m.label}</span>
                    <span className={m.good ? "" : `text-${riskTone(m.value)}`}>{m.value}</span>
                  </div>
                  <div className="mt-1">
                    <Bar
                      value={m.value}
                      tone={m.good ? (m.value >= 85 ? "ok" : m.value >= 70 ? "medium" : "crit") : riskTone(m.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag>CRIT {a.criticality}</Tag>
              <Tag>{a.operatingHours.toLocaleString()} h</Tag>
              {a.standby && <Tag>{a.active ? "ACTIVATED" : "STANDBY"}</Tag>}
              <Link
                to="/twin/$assetId"
                params={{ assetId: a.id }}
                className="ml-auto font-mono text-[11px] text-primary hover:underline"
              >
                Digital twin →
              </Link>
            </div>
          </Panel>
        ))}
        {shown.length === 0 && <p className="text-sm text-muted-foreground">No assets match that filter.</p>}
      </div>
    </AppShell>
  );
}
