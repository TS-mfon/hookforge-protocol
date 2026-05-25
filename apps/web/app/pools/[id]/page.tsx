import { notFound } from "next/navigation";
import { ContractActions } from "@/components/contract-actions";
import { EmptyState, LivePoolOrganism, Metric, PageShell, Panel } from "@/components/ui";
import { explorerTx, getTerminalState, MODULES, XLAYER } from "@/lib/xlayer";

export function generateStaticParams() {
  return [{ id: "wokb-usdc" }];
}

export default async function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "wokb-usdc") notFound();
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;

  return (
    <PageShell eyebrow="WOKB/USDC" title="HookForge X Layer pool terminal" copy="Live pool metrics, deployed modules, hook actions, and activity for the only registered HookForge pool.">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <LivePoolOrganism metrics={metrics} large />
        <div className="grid gap-4 md:grid-cols-2">
          <Metric label="Risk Score" value={metrics?.riskScore ?? "not read"} />
          <Metric label="Fee Memory" value={metrics?.feeMemory ?? "not read"} />
          <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
          <Metric label="Liquidity Health" value={metrics ? `${metrics.liquidityHealth}%` : "not read"} tone="green" />
          <Metric label="Volatility" value={metrics?.volatility ?? "not read"} tone="amber" />
          <Metric label="Quest Progress" value={metrics?.questProgress ?? "not read"} tone="green" />
        </div>
      </div>

      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-semibold text-white">Enabled modules</h2>
          <div className="grid gap-2">
            {state.modules.map((module) => (
              <div key={module.key} className="rounded border border-white/10 bg-black/24 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{module.title}</p>
                  <span className={`rounded border px-2 py-1 text-xs ${module.enabled ? "border-forge-green/30 text-forge-green" : "border-forge-amber/30 text-forge-amber"}`}>{module.enabled ? "enabled" : "not registered"}</span>
                </div>
                <p className="mt-2 text-sm text-white/48">{module.role}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-4 text-xl font-semibold text-white">Recent pool activity</h2>
          <div className="space-y-3">
            {state.activity.length ? state.activity.slice(0, 10).map((event) => (
              <a href={explorerTx(event.txHash)} target="_blank" key={`${event.txHash}-${event.logIndex}`} className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/30">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-1 text-sm text-white/48">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
              </a>
            )) : <EmptyState title="No events indexed" copy="Run a Demo Lab action to produce HookForge events for this pool." />}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel>
          <h2 className="mb-4 text-xl font-semibold text-white">Trading status</h2>
          <p className="text-sm leading-6 text-white/60">
            Hook operations are live. Full Universal Router swap execution is not exposed until the permission-mined Uniswap v4 hook pool is deployed and registered. The app does not fake swaps, quotes, TVL, or volume.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Metric label="WOKB" value={`${XLAYER.wokb.slice(0, 8)}...`} />
            <Metric label="USDC" value={`${XLAYER.usdc.slice(0, 8)}...`} />
            <Metric label="V4 Modules" value={MODULES.length} tone="green" />
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
