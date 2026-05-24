import { notFound } from "next/navigation";
import { pools, recommendations } from "@hookforge/shared";
import { Metric, PageShell, Panel, PoolOrganism, QuestList } from "@/components/ui";

export function generateStaticParams() {
  return pools.map((pool) => ({ id: pool.id }));
}

export default async function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pool = pools.find((item) => item.id === id);
  if (!pool) notFound();
  const recs = recommendations.filter((rec) => rec.poolId === pool.id);

  return (
    <PageShell eyebrow={pool.pair} title={pool.name} copy="A full organism view of evolution state, AI logic, fee behavior, active modules, threats, quests, and LP mechanics.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PoolOrganism pool={pool} large />
        <div className="grid gap-4">
          <Metric label="Dynamic Fee" value={`${pool.dynamicFeeBps} bps`} />
          <Metric label="Liquidity Health" value={`${pool.liquidityHealth}%`} tone="green" />
          <Metric label="Volatility" value={`${pool.volatility}%`} tone="amber" />
          <Metric label="Sentiment" value={`${pool.sentiment}%`} tone="green" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 text-xl font-semibold text-white">Active Modules</h2>
          <div className="flex flex-wrap gap-2">
            {pool.activeModules.map((module) => <span key={module} className="rounded border border-forge-cyan/25 bg-forge-cyan/10 px-3 py-2 text-sm text-forge-cyan">{module}</span>)}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-4 text-xl font-semibold text-white">AI Decisions</h2>
          <div className="space-y-3">
            {recs.map((rec) => <div key={rec.id} className="rounded border border-white/10 bg-black/24 p-4 text-sm text-white/62">{rec.title}: <span className="text-white">{rec.action}</span></div>)}
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <QuestList />
      </div>
    </PageShell>
  );
}
