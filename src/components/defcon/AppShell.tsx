import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Bell,
  Boxes,
  Crosshair,
  Database,
  Gauge as GaugeIcon,
  LayoutDashboard,
  Menu,
  Radar,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  Target,
  Wrench,
  X,
} from "lucide-react";
import { useDefcon } from "@/lib/defcon/store";
import { MISSION } from "@/lib/defcon/data";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CopilotPanel } from "./Copilot";
import { SeverityTag, Tag } from "./ui-bits";

const NAV = [
  { to: "/command", label: "Command Center", icon: LayoutDashboard },
  { to: "/fleet", label: "Asset Fleet", icon: Boxes },
  { to: "/maintenance", label: "Predictive Maintenance", icon: Wrench },
  { to: "/incidents", label: "Alert Correlation", icon: AlertTriangle },
  { to: "/intel", label: "Threat Intelligence", icon: Crosshair },
  { to: "/mission", label: "Mission Impact", icon: Target },
  { to: "/simulator", label: "What-If Simulator", icon: GaugeIcon },
  { to: "/ingestion", label: "Data & Knowledge", icon: Database },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-primary")} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
      <Shield className="h-6 w-6 text-primary" />
      <div>
        <p className="font-mono text-sm font-bold tracking-[0.22em]">DEFCON-X</p>
        <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-muted-foreground">
          Readiness &amp; Threat Copilot
        </p>
      </div>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { readiness, role, setRole, notifications, dismissNotification, feed, copilotOpen, setCopilotOpen } =
    useDefcon();
  const [mobileNav, setMobileNav] = useState(false);
  const bandTone =
    readiness.band === "READY" ? "text-ok" : readiness.band === "CONDITIONAL" ? "text-medium" : "text-crit";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 border-b border-primary/30 bg-primary/10 px-4 py-1 text-center font-mono text-[10px] tracking-[0.24em] uppercase text-primary">
        {MISSION.classificationBanner}
      </div>

      <div className="flex">
        <aside className="sticky top-[26px] hidden h-[calc(100vh-26px)] w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
          <Brand />
          <div className="flex-1 overflow-y-auto">
            <NavList />
          </div>
          <div className="border-t border-sidebar-border p-3">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              Mission {MISSION.name}
            </p>
            <p className={cn("mt-1 text-lg font-semibold", bandTone)}>
              {readiness.overall}% · {readiness.band}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-[26px] z-30 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="mr-auto flex items-center gap-2">
              <Radar className="h-4 w-4 text-primary scan-pulse" />
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                Live feed active · {feed.length} events
              </span>
            </div>

            <Tag tone={cn("border-border bg-muted/40", bandTone)}>
              Readiness {readiness.overall}%
            </Tag>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="font-mono text-[11px]">{notifications.length}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.18em] uppercase">
                  Notifications
                </DropdownMenuLabel>
                {notifications.length === 0 && (
                  <p className="px-2 py-3 text-xs text-muted-foreground">All caught up.</p>
                )}
                {notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex-col items-start gap-1"
                    onSelect={(e) => {
                      e.preventDefault();
                      dismissNotification(n.id);
                    }}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <SeverityTag severity={n.severity} />
                      <span className="font-mono text-[10px] text-muted-foreground">{n.ts}</span>
                    </div>
                    <p className="text-xs">{n.message}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="font-mono text-[11px]">{role}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.18em] uppercase">
                  Switch role view
                </DropdownMenuLabel>
                {(["COMMANDER", "ANALYST", "MAINTENANCE"] as const).map((r) => (
                  <DropdownMenuItem key={r} onSelect={() => setRole(r)}>
                    {r}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="gap-2" onClick={() => setCopilotOpen(true)}>
              <Sparkles className="h-4 w-4" />
              Copilot
            </Button>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>

          <footer className="border-t border-border px-4 py-6 text-center font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground sm:px-6">
            DEFCON-X prototype · synthetic data · AI output is decision support, not autonomous action
          </footer>
        </div>
      </div>

      <Sheet open={mobileNav} onOpenChange={setMobileNav}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Brand />
          <NavList onNavigate={() => setMobileNav(false)} />
        </SheetContent>
      </Sheet>

      <Sheet open={copilotOpen} onOpenChange={setCopilotOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-lg">
          <SheetTitle className="sr-only">DEFCON-X Copilot</SheetTitle>
          <CopilotPanel onClose={() => setCopilotOpen(false)} />
        </SheetContent>
      </Sheet>

      <button
        onClick={() => setCopilotOpen(true)}
        className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
        aria-label="Open copilot"
      >
        <Sparkles className="h-5 w-5" />
      </button>
      <span className="hidden">
        <X />
      </span>
    </div>
  );
}
