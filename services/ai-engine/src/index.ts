import { pools, type AIRecommendation } from "@hookforge/shared";

export function recommendForPool(poolId: string): AIRecommendation {
  const pool = pools.find((item) => item.id === poolId) ?? pools[0];
  const critical = pool.threat === "Critical" || pool.volatility > 85;
  return {
    id: `ai-${pool.id}-${Date.now()}`,
    agent: critical ? "mev-defense" : "liquidity",
    poolId: pool.id,
    title: critical ? "Critical defense envelope recommended" : "Liquidity optimization recommended",
    rationale: critical
      ? "Risk and volatility exceed defensive thresholds while fee memory remains active."
      : "Liquidity health can improve by shifting incentives toward active ranges.",
    action: critical ? "Raise dynamic fee within cap and activate swap cooldown." : "Boost Guardian rewards for active range liquidity.",
    confidence: critical ? 95 : 88,
    bounded: true,
    createdAt: new Date().toISOString()
  };
}

if (process.env.RUN_AI_ONCE === "true") {
  console.log(JSON.stringify(pools.map((pool) => recommendForPool(pool.id)), null, 2));
}
