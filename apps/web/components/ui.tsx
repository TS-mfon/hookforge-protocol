import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, Zap } from "lucide-react";
import { evolutionLabel, metricThreat, type HookMetrics } from "@/lib/xlayer";

export function PageShell({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children: React.ReactNode }) {
  return (
    <main className="grid-surface min-h-[calc(100vh-68px)]">
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="mb-8 max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-forge-cyan">{eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-white md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/62 md:text-lg">{copy}</p>
        </div>
        {children}
      </section>
    </main>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded border border-white/10 bg-white/[0.045] p-5 shadow-glow backdrop-blur ${className}`}>{children}</div>;
}

export function Metric({ label, value, tone = "cyan" }: { label: string; value: string | number; tone?: "cyan" | "green" | "amber" | "red" }) {
  const color = {
    cyan: "text-forge-cyan",
    green: "text-forge-green",
    amber: "text-forge-amber",
    red: "text-forge-red"
  }[tone];
  return (
    <div className="rounded border border-white/10 bg-black/24 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/44">{label}</p>
      <p className={`mt-2 break-words text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export function LivePoolOrganism({ metrics, large = false }: { metrics: HookMetrics | null; large?: boolean }) {
  const threat = metricThreat(metrics);
  return (
    <div className={`scanline relative grid ${large ? "min-h-[440px]" : "min-h-[260px]"} place-items-center overflow-hidden rounded border border-forge-cyan/20 bg-black/35`}>
      <div className={`${large ? "h-72 w-72" : "h-44 w-44"} organism rounded-full border border-forge-cyan/35 shadow-glow`} />
      <div className="absolute inset-8 rounded-full border border-dashed border-forge-green/20" />
      <div className="absolute inset-16 rounded-full border border-dashed border-forge-cyan/18" />
      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
        <Metric label="Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} tone="cyan" />
        <Metric label="Health" value={metrics ? `${metrics.liquidityHealth}%` : "not read"} tone="green" />
        <Metric label="Threat" value={threat} tone={threat === "Critical" ? "red" : threat === "Elevated" ? "amber" : "green"} />
      </div>
      <div className="absolute top-5 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/70">
        {metrics ? evolutionLabel(metrics.evolutionState) : "No metrics"}
      </div>
    </div>
  );
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded border border-forge-amber/30 bg-forge-amber/10 p-5">
      <p className="font-semibold text-forge-amber">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/62">{copy}</p>
    </div>
  );
}

export function CTA() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/dashboard" className="inline-flex items-center gap-2 rounded bg-forge-cyan px-5 py-3 text-sm font-semibold text-black transition hover:bg-white">
        Open Command Center <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href="/demo-lab" className="inline-flex items-center gap-2 rounded border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-forge-green/50 hover:bg-white/8">
        Run Demo Lab <Zap className="h-4 w-4 text-forge-green" />
      </Link>
    </div>
  );
}

export function SafetyList() {
  const items = ["Emergency pause", "Module allowlist", "Gas ceilings", "Parameter caps", "X Layer tx receipts", "Explorer-linked actions", "No fake live values", "Explicit unavailable states"];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3 rounded border border-white/10 bg-black/24 p-3 text-sm text-white/70">
          <CheckCircle2 className="h-4 w-4 text-forge-green" />
          {item}
        </div>
      ))}
    </div>
  );
}

export function SecurityBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-forge-green/30 bg-forge-green/10 px-4 py-2 text-sm text-forge-green">
      <ShieldAlert className="h-4 w-4" />
      live X Layer contracts
    </div>
  );
}

