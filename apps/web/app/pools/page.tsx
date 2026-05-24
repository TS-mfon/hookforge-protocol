import { pools } from "@hookforge/shared";
import { PageShell, PoolCard } from "@/components/ui";

export default function PoolsPage() {
  return (
    <PageShell eyebrow="Adaptive Pools" title="Programmable market organisms" copy="Every pool exposes evolution state, dynamic fees, active modules, risk posture, liquidity health, and AI confidence.">
      <div className="grid gap-5 lg:grid-cols-3">
        {pools.map((pool) => <PoolCard key={pool.id} pool={pool} />)}
      </div>
    </PageShell>
  );
}
