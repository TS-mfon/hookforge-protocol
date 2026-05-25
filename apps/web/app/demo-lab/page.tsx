import { ContractActions } from "@/components/contract-actions";
import { EmptyState, LivePoolOrganism, Metric, PageShell, Panel } from "@/components/ui";
import { explorerTx, getTerminalState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function DemoLabPage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;

  return (
    <PageShell eyebrow="Demo Lab" title="Run real HookForge transactions" copy="Every button sends a real X Layer transaction to the deployed HookKernel. The useful output is the tx hash, emitted events, and changed PoolStateManager metrics.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <LivePoolOrganism metrics={metrics} large />
        <div className="space-y-6">
          <ContractActions hookAddress={state.deployment.hookAddress} />
          <Panel>
            <h2 className="mb-5 text-xl font-semibold text-white">Before you run a scenario</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <Metric label="Risk" value={metrics?.riskScore ?? "not read"} />
              <Metric label="Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
              <Metric label="Health" value={metrics ? `${metrics.liquidityHealth}%` : "not read"} tone="green" />
              <Metric label="Quest" value={metrics?.questProgress ?? "not read"} tone="amber" />
            </div>
            <p className="mt-4 text-sm leading-6 text-white/56">After a wallet confirms a transaction, wait for the receipt and refresh the page. The panels will read the updated onchain state instead of showing expected/fake outcomes.</p>
          </Panel>
        </div>
      </div>
      <div className="mt-6">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Latest scenario evidence</h2>
          <div className="space-y-3">
            {state.activity.length ? state.activity.slice(0, 8).map((event) => (
              <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/30">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-1 text-sm text-white/52">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
              </a>
            )) : <EmptyState title="No scenario evidence yet" copy="Connect a wallet and run an operation to create a real X Layer transaction." />}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
