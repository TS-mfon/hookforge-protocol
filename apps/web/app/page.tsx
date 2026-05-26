import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CTA, LivePoolOrganism, Metric, Panel, SecurityBadge } from "@/components/ui";
import { explorerAddress, getHookLabState, metricThreat } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const state = await getHookLabState();
  const metrics = state.deployment.metrics;
  const routes = [
    ["Use hook", "/use-hook", "Connect a wallet, run real HookKernel calls, and see decoded hook output."],
    ["Proof", "/proof", "Inspect live X Layer contract state, receipts, and decoded events."],
    ["v4 route", "/v4-route", "See the exact path from this live hook proof to routed Uniswap v4 swaps."]
  ] as const;

  return (
    <main className="grid-surface">
      <section className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SecurityBadge />
          <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Test adaptive Uniswap v4 hook behavior on X Layer.
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/68">
            HookForge is now focused on one job: proving how a deployed hook changes pool behavior before a full routed v4 pool goes live.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
            Visitors can connect a wallet, run hook checkpoints, and see real transaction output: decoded events, before/after metrics, risk response, whale pressure, sentiment, activity progress, and dynamic fees.
          </p>
          <div className="mt-8"><CTA /></div>
        </div>
        <LivePoolOrganism metrics={metrics} large />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-4 md:grid-cols-5">
          <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
          <Metric label="Risk Score" value={metrics?.riskScore ?? "not read"} tone={metricThreat(metrics) === "Elevated" ? "amber" : "cyan"} />
          <Metric label="Whale Pressure" value={metrics?.whalePressure ?? "not read"} tone="amber" />
          <Metric label="Sentiment" value={metrics?.sentiment ?? "not read"} tone="green" />
          <Metric label="Activity Progress" value={metrics?.questProgress ?? "not read"} tone="green" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {routes.map(([title, href, copy]) => (
            <Link key={href} href={href} className="group rounded border border-white/10 bg-white/[0.045] p-5 shadow-glow transition hover:border-forge-cyan/40 hover:bg-white/[0.07]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-white">{title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/58">{copy}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 text-forge-cyan transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <Panel className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Current deployment</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">The dApp reads from deployed HookForge contracts.</h2>
              <p className="mt-3 text-sm leading-6 text-white/56">
                This is not a static mockup. The hook page submits wallet transactions, and the proof page decodes the resulting receipts.
              </p>
            </div>
            <div className="grid gap-3">
              <a href={state.deployment.hookAddress ? explorerAddress(state.deployment.hookAddress) : "#"} target="_blank" className="flex items-center gap-3 rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/40">
                <CheckCircle2 className="h-4 w-4 text-forge-green" />
                <span className="flex-1 text-sm text-white/64">HookKernel</span>
                <span className="break-all font-mono text-xs text-forge-cyan">{state.deployment.hookAddress ?? "not configured"}</span>
                <ExternalLink className="h-4 w-4 text-white/36" />
              </a>
              <a href={state.deployment.stateManager ? explorerAddress(state.deployment.stateManager) : "#"} target="_blank" className="flex items-center gap-3 rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/40">
                <CheckCircle2 className="h-4 w-4 text-forge-green" />
                <span className="flex-1 text-sm text-white/64">StateManager</span>
                <span className="break-all font-mono text-xs text-forge-cyan">{state.deployment.stateManager ?? "not configured"}</span>
                <ExternalLink className="h-4 w-4 text-white/36" />
              </a>
            </div>
          </div>
        </Panel>
      </section>
    </main>
  );
}
