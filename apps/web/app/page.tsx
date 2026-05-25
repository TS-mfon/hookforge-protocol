import Link from "next/link";
import { ArrowRight, BrainCircuit, Layers3, ShieldCheck } from "lucide-react";
import { modules, pools } from "@hookforge/shared";
import { HookStatus } from "@/components/hook-status";
import { CTA, ModuleCard, Panel, PoolCard, PoolOrganism, SecurityBadge, SystemStrip } from "@/components/ui";

export default function HomePage() {
  const heroPool = pools[0];
  return (
    <main className="grid-surface">
      <section className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SecurityBadge />
          <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            HookForge Protocol
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/68">
            The Operating System for Adaptive Markets. Programmable behavioral infrastructure for Uniswap v4 pools on X Layer.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
            Liquidity pools become autonomous economic organisms that evolve, defend, rebalance, price risk, coordinate LPs, and listen to market intelligence.
          </p>
          <div className="mt-8"><CTA /></div>
        </div>
        <PoolOrganism pool={heroPool} large />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <HookStatus />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <SystemStrip />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Panel>
            <BrainCircuit className="mb-5 h-7 w-7 text-forge-cyan" />
            <h2 className="text-xl font-semibold text-white">Agentic Market Intelligence</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">AI agents recommend bounded parameter changes, simulate attacks, detect instability, and explain every action.</p>
          </Panel>
          <Panel>
            <ShieldCheck className="mb-5 h-7 w-7 text-forge-green" />
            <h2 className="text-xl font-semibold text-white">Defensive Liquidity</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">Anti-MEV, TWAP protection, whale intelligence, and fee memory create adaptive immune responses for pools.</p>
          </Panel>
          <Panel>
            <Layers3 className="mb-5 h-7 w-7 text-forge-amber" />
            <h2 className="text-xl font-semibold text-white">Modular Hook OS</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">The Hook Kernel routes every Uniswap v4 checkpoint through configurable modules with strict guardrails.</p>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Live organisms</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Adaptive pools</h2>
          </div>
          <Link href="/pools" className="flex items-center gap-2 text-sm text-forge-green">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {pools.map((pool) => <PoolCard key={pool.id} pool={pool} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Function pages</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Every adaptive capability is modular</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.slice(0, 6).map((module) => <ModuleCard key={module.key} module={module} />)}
        </div>
      </section>
    </main>
  );
}
