import { pools } from "@hookforge/shared";
import { Metric, PageShell, Panel } from "@/components/ui";

export default function AnalyticsPage() {
  return (
    <PageShell eyebrow="Analytics" title="Fees, volume, health, volatility, and evolution history" copy="Operational analytics for adaptive markets, built around behavior rather than static pool totals.">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total TVL" value="$121.4M" />
        <Metric label="Protected Volume" value="$58.1M" tone="green" />
        <Metric label="Avg Health" value="76%" tone="amber" />
        <Metric label="Threat Events" value="29" tone="red" />
      </div>
      <div className="mt-6 grid gap-4">
        {pools.map((pool) => (
          <Panel key={pool.id}>
            <div className="grid gap-4 md:grid-cols-5">
              <div>
                <p className="font-semibold text-white">{pool.name}</p>
                <p className="text-sm text-white/48">{pool.pair}</p>
              </div>
              <Metric label="Fee" value={`${pool.dynamicFeeBps} bps`} />
              <Metric label="Health" value={`${pool.liquidityHealth}%`} tone="green" />
              <Metric label="Volatility" value={`${pool.volatility}%`} tone="amber" />
              <Metric label="AI" value={`${pool.aiConfidence}%`} />
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
