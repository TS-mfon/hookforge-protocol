import { CheckCircle2, ExternalLink } from "lucide-react";
import { HookScenarioRunner } from "@/components/contract-actions";
import { CTA, LivePoolOrganism, Metric, Panel, SafetyList, SecurityBadge } from "@/components/ui";
import { explorerAddress, explorerTx, getHookLabState, metricThreat } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const state = await getHookLabState();
  const metrics = state.deployment.metrics;
  const latest = state.activity.slice(0, 6);

  return (
    <main className="grid-surface">
      <section className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SecurityBadge />
          <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            Adaptive Uniswap v4 hook behavior, live on X Layer.
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/68">
            HookForge helps pool creators prove how their market reacts before they launch a fully routed Uniswap v4 pool.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
            Connect a wallet, run a hook scenario, and watch real onchain metrics change: risk, whale pressure, sentiment, quest progress, and dynamic fees.
          </p>
          <div className="mt-8"><CTA /></div>
        </div>
        <LivePoolOrganism metrics={metrics} large />
      </section>

      <section id="use-hook" className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel>
            <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">For pool creators</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">What users do with the hook</h2>
            <div className="mt-6 space-y-4 text-sm leading-6 text-white/60">
              <p>Pool creators use HookForge to attach adaptive behavior to a Uniswap v4 pool: defensive fee changes, whale pressure scoring, sentiment-aware tuning, and LP protection checks.</p>
              <p>This MVP proves the behavior with a deployed HookKernel and real X Layer transactions. It does not pretend routed v4 swaps are live until the permission-mined hook and initialized v4 pool are deployed.</p>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                "Show judges exactly which hook checkpoint ran.",
                "Show the transaction hash and updated pool metrics.",
                "Explain the value to token teams without burying it in dashboards."
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded border border-white/10 bg-black/24 p-3 text-sm text-white/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-forge-green" />
                  {item}
                </div>
              ))}
            </div>
          </Panel>
          <HookScenarioRunner hookAddress={state.deployment.hookAddress} />
        </div>
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

      <section id="proof" className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel>
            <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Deployed hook proof</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Everything shown here is read from X Layer.</h2>
            <div className="mt-6 space-y-3 text-sm">
              <a href={state.deployment.hookAddress ? explorerAddress(state.deployment.hookAddress) : "#"} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/40">
                <span className="block text-white/46">HookKernel</span>
                <span className="mt-1 block break-all font-mono text-forge-cyan">{state.deployment.hookAddress ?? "not configured"}</span>
              </a>
              <a href={state.deployment.stateManager ? explorerAddress(state.deployment.stateManager) : "#"} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/40">
                <span className="block text-white/46">State manager</span>
                <span className="mt-1 block break-all font-mono text-forge-cyan">{state.deployment.stateManager ?? "not configured"}</span>
              </a>
            </div>
            <div className="mt-6">
              <SafetyList />
            </div>
          </Panel>

          <Panel>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Recent hook receipts</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Transaction proof feed</h2>
              </div>
              <ExternalLink className="h-5 w-5 text-forge-cyan" />
            </div>
            <div className="grid gap-3">
              {latest.length ? latest.map((event) => (
                <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="rounded border border-white/10 bg-black/24 p-4 transition hover:border-forge-cyan/40">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-white">{event.name}</p>
                    <p className="font-mono text-xs text-forge-cyan">{event.txHash.slice(0, 10)}...{event.txHash.slice(-6)}</p>
                  </div>
                  <p className="mt-2 text-sm text-white/52">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
                </a>
              )) : (
                <p className="rounded border border-white/10 bg-black/24 p-4 text-white/60">No HookForge events indexed from X Layer yet.</p>
              )}
            </div>
          </Panel>
        </div>
      </section>

      <section id="v4-route" className="mx-auto max-w-7xl px-4 pb-20">
        <Panel>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Full Uniswap v4 route</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">The next deploy turns this proof into routed pool swapping.</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                To route real swaps through HookForge, the hook must be redeployed at a permission-mined Uniswap v4 hook address, then used in a new initialized PoolManager pool. Until then, this MVP focuses on proving the adaptive hook behavior with real transactions.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ["Mine hook address", "Encode before/after swap and liquidity permissions into the deployed address."],
                ["Initialize v4 pool", "Create the WOKB/USDC PoolKey with the mined hook address."],
                ["Add liquidity", "Seed the pool through PositionManager."],
                ["Enable routing", "Replace scenario calls with Universal Router swaps once the pool exists."]
              ].map(([title, copy], index) => (
                <div key={title} className="flex gap-3 rounded border border-white/10 bg-black/24 p-4">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded border border-forge-green/30 bg-forge-green/10 text-sm font-semibold text-forge-green">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-white/52">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>
    </main>
  );
}
