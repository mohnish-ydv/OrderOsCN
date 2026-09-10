import { Link, useLocation } from "wouter";
import { Bell, Boxes, BrainCircuit, ChevronRight, CircleHelp, ClipboardList, Command, Database, LayoutDashboard, Menu, PackageSearch, PanelLeftClose, Settings2, Store, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Command center", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/dealers", label: "Dealers", icon: UsersRound },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/memory", label: "AI memory", icon: BrainCircuit },
  { href: "/analytics", label: "Analytics", icon: Database },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-[248px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"><Command size={18} strokeWidth={2.4} /></span>
              <div><div className="display text-[17px] font-800 tracking-tight">OrderOS</div><div className="mono mt-0.5 text-[9px] uppercase tracking-[.18em] text-sidebar-foreground/55">order intelligence</div></div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="rounded-md p-1 text-sidebar-foreground/55 hover:bg-sidebar-accent lg:hidden" data-testid="button-close-sidebar"><X size={18} /></button>
          </div>
          <div className="mx-5 mb-5 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Mumbai workspace</div>
            <div className="mt-1 pl-4 text-[10px] text-sidebar-foreground/50">Synthetic demo data · IST</div>
          </div>
          <nav className="space-y-1 px-3">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-sidebar-foreground/35">Workspace</div>
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? location === "/" : location.startsWith(href);
              return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn("group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-sidebar-foreground/62 hover:bg-sidebar-accent hover:text-sidebar-foreground", active && "bg-sidebar-accent text-sidebar-foreground shadow-sm")} data-testid={`link-nav-${label.toLowerCase().replaceAll(" ", "-")}`}><Icon size={16} className={cn(active ? "text-sidebar-primary" : "text-sidebar-foreground/45", "shrink-0")} /><span>{label}</span>{label === "Orders" && <span className="ml-auto rounded bg-sidebar-primary/15 px-1.5 py-0.5 text-[10px] text-sidebar-primary">7</span>}</Link>;
            })}
          </nav>
          <div className="mt-auto space-y-1 border-t border-sidebar-border px-3 py-4">
            <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground" data-testid="link-nav-settings"><Settings2 size={16} />Settings</Link>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground" data-testid="button-help"><CircleHelp size={16} />Help & feedback</button>
            <div className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2.5"><div className="grid h-7 w-7 place-items-center rounded-full bg-sidebar-primary text-[10px] font-bold text-sidebar-primary-foreground">AR</div><div className="min-w-0"><div className="truncate text-[11px] font-semibold">Anika Rao</div><div className="truncate text-[10px] text-sidebar-foreground/40">Operations lead</div></div></div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 hover:bg-muted lg:hidden" data-testid="button-open-sidebar"><Menu size={20} /></button><div className="hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex"><span>Workspace</span><ChevronRight size={13} /><span className="font-semibold text-foreground">{nav.find((item) => location === item.href || (item.href !== "/" && location.startsWith(item.href)))?.label || "Settings"}</span></div></div>
          <div className="flex items-center gap-3"><button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" data-testid="button-notifications"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" /></button><div className="hidden h-5 w-px bg-border sm:block" /><div className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">AR</div><span className="hidden text-[11px] font-semibold sm:block">Anika Rao</span></div></div>
        </header>
        <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mono mb-2 text-[10px] font-medium uppercase tracking-[.2em] text-muted-foreground">{eyebrow || "Workspace"}</div><h1 className="display text-2xl font-800 tracking-tight text-foreground md:text-[29px]">{title}</h1>{description && <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-muted-foreground">{description}</p>}</div>{actions && <div className="flex items-center gap-2">{actions}</div>}</div>;
}

export function Button({ children, variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return <button className={cn("inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3.5 text-[11px] font-bold transition-all active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90", variant === "secondary" && "border border-border bg-card text-foreground hover:bg-muted", variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground", variant === "danger" && "bg-destructive text-destructive-foreground hover:bg-destructive/90", className)} {...props}>{children}</button>;
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { new: "bg-sky-100 text-sky-800", processing: "bg-violet-100 text-violet-800", attention: "bg-amber-100 text-amber-800", approved: "bg-emerald-100 text-emerald-800", blocked: "bg-red-100 text-red-800", completed: "bg-teal-100 text-teal-800", healthy: "bg-emerald-100 text-emerald-800", low: "bg-amber-100 text-amber-800", out: "bg-red-100 text-red-800", confirmed: "bg-emerald-100 text-emerald-800", suggested: "bg-amber-100 text-amber-800", active: "bg-emerald-100 text-emerald-800", paused: "bg-slate-100 text-slate-600" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold capitalize", map[status] || "bg-muted text-muted-foreground")}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{status.replace("_", " ")}</span>;
}

export function MetricCard({ label, value, detail, tone = "neutral", icon: Icon }: { label: string; value: string | number; detail?: string; tone?: "neutral" | "accent" | "danger" | "success"; icon?: React.ElementType }) {
  return <div className="panel group relative overflow-hidden p-4"><div className="flex items-start justify-between"><div className="mono text-[10px] font-medium uppercase tracking-[.15em] text-muted-foreground">{label}</div>{Icon && <Icon size={16} className={cn("text-muted-foreground/50", tone === "accent" && "text-accent", tone === "danger" && "text-destructive", tone === "success" && "text-emerald-600")} />}</div><div className="mt-3 display text-2xl font-800 tracking-tight">{value}</div>{detail && <div className={cn("mt-1 text-[10px] font-semibold text-muted-foreground", tone === "danger" && "text-destructive", tone === "success" && "text-emerald-700")}>{detail}</div>}<div className={cn("absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full", tone === "danger" && "bg-destructive", tone === "success" && "bg-emerald-500")} /></div>;
}

export function LoadingBlock({ rows = 5 }: { rows?: number }) {
  return <div className="space-y-3 animate-pulse">{Array.from({ length: rows }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-muted" />)}</div>;
}

export function QueryState({ loading, error, empty, onRetry, children }: { loading?: boolean; error?: boolean; empty?: boolean; onRetry?: () => void; children: React.ReactNode }) {
  if (loading) return <LoadingBlock />;
  if (error) return <div className="panel flex min-h-52 flex-col items-center justify-center p-8 text-center"><div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-50 text-destructive"><X size={18} /></div><div className="text-sm font-bold">Couldn’t load this view</div><p className="mt-1 text-xs text-muted-foreground">The workspace is still reachable. Try again in a moment.</p>{onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry} data-testid="button-retry">Retry</Button>}</div>;
  if (empty) return <div className="panel flex min-h-52 flex-col items-center justify-center p-8 text-center"><div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground"><PackageSearch size={18} /></div><div className="text-sm font-bold">Nothing here yet</div><p className="mt-1 text-xs text-muted-foreground">New signals will appear as orders and dealer messages arrive.</p></div>;
  return <>{children}</>;
}

export function SearchInput({ value, onChange, placeholder = "Search" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <div className="relative"><PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/15" data-testid="input-search" /></div>;
}

export function Confidence({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return <div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", percent >= 90 ? "bg-emerald-500" : percent >= 75 ? "bg-amber-500" : "bg-destructive")} style={{ width: `${percent}%` }} /></div><span className="mono text-[10px] text-muted-foreground">{percent}%</span></div>;
}