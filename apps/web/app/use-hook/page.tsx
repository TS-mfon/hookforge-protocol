import { CheckCircle2 } from "lucide-react";
import { HookScenarioRunner } from "@/components/contract-actions";
import { Metric, PageShell, Panel } from "@/components/ui";
import { getHookLabState, metricThreat } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function UseHookPage() {
  const state = await getHookLabState();
  const metrics = state.deployment.metrics;

  return (
    <PageShell
      eyebrow="Use hook"
      title="Run the deployed HookForge hook and see its real output."
      copy="This page is the working dApp surface. It connects to a wallet, submits real X Layer transactions to the HookKernel, waits for receipts, decodes HookForge events, and compares before/after pool metrics."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
        <Metric label="Risk Score" value={metrics?.riskScore ?? "not read"} tone={metricThreat(metrics) === "Elevated" ? "amber" : "cyan"} />
        <Metric label="Whale Pressure" value={metrics?.whalePressure ?? "not read"} tone="amber" />
        <Metric label="Sentiment" value={metrics?.sentiment ?? "not read"} tone="green" />
        <Metric label="Activity" value={metrics?.questProgress ?? "not read"} tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <Panel>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">What this proves</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">The hook is useful before routed v4 swaps are live.</h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-white/60">
            <p>A token team or pool creator can test how HookForge responds to market behavior: whale pressure, volatility, sentiment, liquidity protection, and dynamic fees.</p>
            <p>Every run produces an onchain receipt. The output panel shows exactly what changed instead of pretending a swap route exists.</p>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              "Wallet signs the transaction.",
              "HookKernel executes a real checkpoint.",
              "PoolStateManager records updated metrics.",
              "The UI decodes receipt events and metric deltas."
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
    </PageShell>
  );
}
