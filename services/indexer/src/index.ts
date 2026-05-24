import { pools, recommendations } from "@hookforge/shared";

export interface IndexedEvent {
  type: string;
  poolId: string;
  payload: unknown;
  createdAt: string;
}

export function buildDemoIndex(): IndexedEvent[] {
  const events: IndexedEvent[] = pools.flatMap((pool) => [
    { type: "PoolMetricsUpdated", poolId: pool.id, payload: pool, createdAt: new Date().toISOString() },
    { type: "EvolutionStateChanged", poolId: pool.id, payload: { state: pool.evolution }, createdAt: new Date().toISOString() }
  ]);
  return events.concat(recommendations.map((rec) => ({
    type: "AIRecommendationSubmitted",
    poolId: rec.poolId,
    payload: rec,
    createdAt: new Date().toISOString()
  })));
}

if (process.env.RUN_INDEXER_ONCE === "true") {
  console.log(JSON.stringify(buildDemoIndex(), null, 2));
}
