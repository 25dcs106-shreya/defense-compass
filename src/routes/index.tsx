import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, Brain, Radar, Shield, Target } from "lucide-react";
import { MISSION } from "@/lib/defcon/data";
import { Tag } from "@/components/defcon/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DEFCON-X — AI Defence Readiness & Threat Intelligence Copilot" },
      {
        name: "description",
        content:
          "DEFCON-X unifies sensor anomalies, cyber threat correlation and mission impact into one AI decision-support copilot for defence readiness.",
      },
      { property: "og:title", content: "DEFCON-X — Defence Readiness Copilot" },
      {
        property: "og:description",
        content:
          "From sensor anomaly to cyber threat to mission impact — one AI copilot for complete defence readiness.",
      },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  {
    icon: Activity,
    title: "Predictive Maintenance",
    body: "HUMS telemetry trend analysis estimates component failure probability and service windows before degradation becomes mission-affecting.",
  },
  {
    icon: AlertTriangle,
    title: "Alert Correlation",
    body: "Thousands of raw SIEM/EDR alerts are deduplicated, correlated by entity and time window, and reduced to a handful of explainable incidents.",
  },
  {
    icon: Radar,
    title: "Threat Intelligence",
    body: "IOC and ATT&CK matching adds actor context and confidence to every incident, with evidence shown for each attribution.",
  },
  {
    icon: Target,
    title: "Mission Impact",
    body: "Physical, cyber and maintenance risk are weighted by mission criticality into a single readiness picture commanders can act on.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-primary/30 bg-primary/10 px-4 py-1 text-center font-mono text-[10px] tracking-[0.24em] uppercase text-primary">
        {MISSION.classificationBanner}
      </div>

      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <p className="font-mono text-sm font-bold tracking-[0.22em]">DEFCON-X</p>
            <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted-foreground">
              Readiness &amp; Threat Copilot
            </p>
          </div>
        </div>
        <Link
          to="/command"
          className="rounded-md bg-primary px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Enter Command Center
        </Link>
      </header>

      <main>
        <section className="grid-bg border-y border-border px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Tag tone="border-primary/50 bg-primary/10 text-primary">
              Hackathon prototype · synthetic data
            </Tag>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              AI Defence Readiness &amp; Threat Intelligence Copilot
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              From sensor anomaly to cyber threat to mission impact — one AI copilot for complete
              defence readiness.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/command"
                className="rounded-md bg-primary px-6 py-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-primary-foreground"
              >
                Launch Demo
              </Link>
              <Link
                to="/incidents"
                className="rounded-md border border-border px-6 py-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-foreground hover:bg-muted/50"
              >
                View Incident Flow
              </Link>
            </div>
            <p className="mt-6 font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
              Mission {MISSION.name} · window {MISSION.window}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-16 sm:grid-cols-2 sm:px-8">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-border bg-card/80 p-6">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-mono text-xs font-bold tracking-[0.18em] uppercase">
                {title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
          <div className="rounded-lg border border-border bg-card/80 p-6">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="font-mono text-xs font-bold tracking-[0.18em] uppercase">
                Human-in-the-loop by design
              </h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              DEFCON-X never acts autonomously. Every score is deterministic and explainable, every
              recommendation shows its evidence and confidence, and every action requires operator
              approval. All data in this prototype is synthetic and fictional.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
        DEFCON-X prototype · decision support, not autonomous action
      </footer>
    </div>
  );
}
