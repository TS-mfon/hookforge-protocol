import { EmptyState, Metric, PageShell, Panel } from "@/components/ui";
import { explorerTx, getTerminalState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  return (
    <PageShell eyebrow="Analytics" title="Real onchain HookForge analytics" copy="Only contract metrics and indexed X Layer events are shown. TVL, volume, and swap quotes are intentionally unavailable until a real v4 pool/indexer exposes them.">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
        <Metric label="Liquidity Health" value={metrics ? `${metrics.liquidityHealth}%` : "not read"} tone="green" />
        <Metric label="Quest Progress" value={metrics?.questProgress ?? "not read"} tone="amber" />
        <Metric label="Indexed Events" value={state.activity.length} tone="green" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Unavailable by design</h2>
          {["TVL", "24h volume", "real swap price", "LP position count"].map((item) => (
            <div key={item} className="mb-3 rounded border border-forge-amber/30 bg-forge-amber/10 p-4 text-sm text-white/62">{item}: not indexed yet</div>
          ))}
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Event analytics</h2>
          <div className="space-y-3">
            {state.activity.length ? state.activity.slice(0, 12).map((event) => (
              <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/30">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-1 text-sm text-white/52">Block {event.blockNumber}</p>
              </a>
            )) : <EmptyState title="No event analytics" copy="Run hook actions to produce events." />}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
