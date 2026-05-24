import Link from "next/link";
import { Activity, ArrowRight, Bot, CheckCircle2, Cpu, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { agents, modules, pools, quests, recommendations, type ModuleDefinition, type PoolState } from "@hookforge/shared";

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
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export function PoolOrganism({ pool, large = false }: { pool: PoolState; large?: boolean }) {
  return (
    <div className={`scanline relative grid ${large ? "min-h-[440px]" : "min-h-[260px]"} place-items-center overflow-hidden rounded border border-forge-cyan/20 bg-black/35`}>
      <div className={`${large ? "h-72 w-72" : "h-44 w-44"} organism rounded-full border border-forge-cyan/35 shadow-glow`} />
      <div className="absolute inset-8 rounded-full border border-dashed border-forge-green/20" />
      <div className="absolute inset-16 rounded-full border border-dashed border-forge-cyan/18" />
      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
        <Metric label="Fee" value={`${pool.dynamicFeeBps} bps`} tone="cyan" />
        <Metric label="Health" value={`${pool.liquidityHealth}%`} tone="green" />
        <Metric label="Threat" value={pool.threat} tone={pool.threat === "Critical" ? "red" : pool.threat === "Elevated" ? "amber" : "green"} />
      </div>
      <div className="absolute top-5 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/70">{pool.evolution}</div>
    </div>
  );
}

export function PoolCard({ pool }: { pool: PoolState }) {
  return (
    <Link href={`/pools/${pool.id}`} className="block rounded border border-white/10 bg-white/[0.045] p-5 transition hover:border-forge-cyan/40 hover:bg-white/[0.07]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{pool.name}</p>
          <p className="text-sm text-white/50">{pool.pair}</p>
        </div>
        <span className="rounded border border-forge-green/30 bg-forge-green/10 px-3 py-1 text-xs text-forge-green">{pool.evolution}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Metric label="TVL" value={pool.tvl} />
        <Metric label="24H" value={pool.volume24h} tone="green" />
        <Metric label="AI" value={`${pool.aiConfidence}%`} tone="amber" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.traits.map((trait) => (
          <span key={trait} className="rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/55">{trait}</span>
        ))}
      </div>
    </Link>
  );
}

export function ModuleCard({ module }: { module: ModuleDefinition }) {
  return (
    <Link href={`/modules/${module.key}`} className="rounded border border-white/10 bg-white/[0.045] p-5 transition hover:border-forge-green/40 hover:bg-white/[0.07]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-forge-cyan/30 bg-forge-cyan/10">
        <Cpu className="h-5 w-5 text-forge-cyan" />
      </div>
      <h3 className="text-xl font-semibold text-white">{module.title}</h3>
      <p className="mt-2 text-sm text-forge-green">{module.tagline}</p>
      <p className="mt-4 text-sm leading-6 text-white/58">{module.description}</p>
    </Link>
  );
}

export function AIStream() {
  return (
    <Panel className="h-full">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Live AI Feed</h2>
        <span className="flex items-center gap-2 text-xs text-forge-green"><span className="h-2 w-2 rounded-full bg-forge-green" />streaming</span>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec) => {
          const agent = agents.find((item) => item.key === rec.agent);
          return (
            <div key={rec.id} className="rounded border border-white/10 bg-black/28 p-4">
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-forge-cyan" />
                <span className="text-sm font-medium text-white">{agent?.name}</span>
                <span className="text-xs text-white/36">{rec.createdAt}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white/90">{rec.title}</p>
              <p className="mt-2 text-sm leading-6 text-white/54">{rec.action}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function QuestList() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {quests.map((quest) => (
        <Panel key={quest.id}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{quest.title}</p>
              <p className="mt-1 text-sm text-white/48">{quest.reward}</p>
            </div>
            <span className="rounded border border-forge-amber/30 bg-forge-amber/10 px-3 py-1 text-xs text-forge-amber">{quest.status}</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-white/10">
            <div className="h-full bg-forge-green" style={{ width: `${quest.progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/44">{quest.progress}% complete</p>
        </Panel>
      ))}
    </div>
  );
}

export function SystemStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Metric label="Adaptive Pools" value={pools.length} />
      <Metric label="Modules Online" value={modules.length} tone="green" />
      <Metric label="AI Agents" value={agents.length} tone="amber" />
      <Metric label="Bounded Actions" value="100%" tone="green" />
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
  const items = ["Emergency pause", "Module allowlist", "Gas ceilings", "Parameter caps", "AI signatures", "Nonce replay protection", "Governance timelocks", "Bounded autonomy"];
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

export function ThreatMatrix() {
  const threats = [
    ["Sandwich pressure", "Elevated", 72],
    ["TWAP deviation", "Watch", 44],
    ["Whale concentration", "Critical", 91],
    ["Liquidity thinning", "Elevated", 68],
    ["Sentiment manipulation", "Watch", 39]
  ];
  return (
    <div className="space-y-3">
      {threats.map(([name, level, value]) => (
        <div key={name} className="rounded border border-white/10 bg-black/24 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white">{name}</span>
            <span className="text-forge-amber">{level}</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-white/10">
            <div className="h-full bg-forge-red" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AgentGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <Link key={agent.key} href={`/ai-agents/${agent.key}`} className="rounded border border-white/10 bg-white/[0.045] p-5 transition hover:border-forge-cyan/40 hover:bg-white/[0.07]">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-forge-green/30 bg-forge-green/10">
            <Sparkles className="h-5 w-5 text-forge-green" />
          </div>
          <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
          <p className="mt-2 text-sm text-white/56">{agent.role}</p>
          <p className="mt-4 text-sm text-forge-cyan">{agent.confidence}% confidence</p>
          <p className="mt-2 text-sm text-white/46">{agent.lastAction}</p>
        </Link>
      ))}
    </div>
  );
}

export function SecurityBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-forge-green/30 bg-forge-green/10 px-4 py-2 text-sm text-forge-green">
      <ShieldAlert className="h-4 w-4" />
      bounded autonomy enabled
    </div>
  );
}
