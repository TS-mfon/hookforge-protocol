import { ExternalLink } from "lucide-react";
import { TxOutputInspector } from "@/components/contract-actions";
import { EmptyState, Metric, PageShell, Panel, SafetyList } from "@/components/ui";
import { explorerAddress, explorerTx, getHookLabState, metricThreat } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function ProofPage() {
  const state = await getHookLabState();
  const metrics = state.deployment.metrics;
  const txs = Array.from(new Map(state.activity.map((event) => [event.txHash, event])).values()).slice(0, 8);

  return (
    <PageShell
      eyebrow="Proof"
      title="Live HookForge proof from X Layer."
      copy="This page shows the deployed contracts, current pool metrics, recent receipts, and decoded hook outputs. It is intentionally limited to verifiable onchain data."
    >
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
        <Metric label="Risk Score" value={metrics?.riskScore ?? "not read"} tone={metricThreat(metrics) === "Elevated" ? "amber" : "cyan"} />
        <Metric label="Whale Pressure" value={metrics?.whalePressure ?? "not read"} tone="amber" />
        <Metric label="Sentiment" value={metrics?.sentiment ?? "not read"} tone="green" />
        <Metric label="Latest Block" value={state.latestBlock || "not read"} tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <Panel>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Deployed contracts</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Contract state is the source of truth.</h2>
          <div className="mt-6 space-y-3 text-sm">
            {[
              ["HookKernel", state.deployment.hookAddress],
              ["StateManager", state.deployment.stateManager],
              ["ModuleRegistry", state.deployment.registry]
            ].map(([label, address]) => (
              <a key={label} href={address ? explorerAddress(address) : "#"} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/40">
                <span className="block text-white/46">{label}</span>
                <span className="mt-1 block break-all font-mono text-forge-cyan">{address ?? "not configured"}</span>
              </a>
            ))}
          </div>
          <div className="mt-6">
            <SafetyList />
          </div>
        </Panel>

        <Panel>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Receipt output</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Recent hook transactions</h2>
            </div>
            <ExternalLink className="h-5 w-5 text-forge-cyan" />
          </div>
          <div className="grid gap-4">
            {txs.length ? txs.map((event) => (
              <div key={event.txHash} className="rounded border border-white/10 bg-black/24 p-4">
                <a href={explorerTx(event.txHash)} target="_blank" className="block transition hover:text-forge-cyan">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-white">{event.name}</p>
                    <p className="font-mono text-xs text-forge-cyan">{event.txHash.slice(0, 10)}...{event.txHash.slice(-6)}</p>
                  </div>
                  <p className="mt-2 text-sm text-white/52">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
                </a>
                <TxOutputInspector txHash={event.txHash} />
              </div>
            )) : (
              <EmptyState title="No receipt activity found" copy="The API did not index recent HookForge events from X Layer. Run a scenario on the Use hook page, then return here." />
            )}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
