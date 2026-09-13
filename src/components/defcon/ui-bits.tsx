import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Severity, AssetStatus } from "@/lib/defcon/types";

export const sevColor: Record<Severity, string> = {
  CRITICAL: "text-crit border-crit/50 bg-crit/10",
  HIGH: "text-high border-high/50 bg-high/10",
  MEDIUM: "text-medium border-medium/50 bg-medium/10",
  LOW: "text-low border-low/50 bg-low/10",
  INFO: "text-muted-foreground border-border bg-muted/40",
};

export const statusColor: Record<AssetStatus, string> = {
  READY: "text-ok border-ok/50 bg-ok/10",
  WARNING: "text-medium border-medium/50 bg-medium/10",
  CRITICAL: "text-crit border-crit/50 bg-crit/10",
  OFFLINE: "text-muted-foreground border-border bg-muted/40",
};

export function Tag({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase",
        tone ?? "border-border bg-muted/40 text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SeverityTag({ severity }: { severity: Severity }) {
  return <Tag tone={sevColor[severity]}>{severity}</Tag>;
}

export function StatusTag({ status }: { status: AssetStatus }) {
  return <Tag tone={statusColor[status]}>{status}</Tag>;
}

export function riskTone(score: number) {
  if (score >= 81) return "crit";
  if (score >= 61) return "high";
  if (score >= 31) return "medium";
  return "ok";
}

export function Panel({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card/80 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur",
        className,
      )}
    >
      {(title || right) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            {title && (
              <h2 className="font-mono text-xs font-bold tracking-[0.18em] uppercase text-foreground">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  unit,
  hint,
  tone = "foreground",
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-4">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 text-3xl leading-none font-semibold", `text-${tone}`)}>
        {value}
        {unit && <span className="ml-1 text-base text-muted-foreground">{unit}</span>}
      </p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Bar({ value, tone = "ok" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded bg-muted">
      <div
        className={cn("h-full rounded transition-all duration-700", `bg-${tone}`)}
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Gauge({ value, label }: { value: number; label: string }) {
  const tone = value >= 85 ? "var(--ok)" : value >= 70 ? "var(--medium)" : "var(--crit)";
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg viewBox="0 0 128 128" className="h-40 w-40 -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, value)) / 100}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-semibold" style={{ color: tone }}>
          {value}
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
