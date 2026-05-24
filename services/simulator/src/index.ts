import { demoScenarios, pools, type PoolState } from "@hookforge/shared";

export function runScenario(key: string, pool: PoolState = pools[0]): PoolState {
  switch (key) {
    case "volatility":
      return { ...pool, volatility: 96, dynamicFeeBps: 118, threat: "Critical", evolution: "Defensive" };
    case "mev":
      return { ...pool, dynamicFeeBps: 132, threat: "Critical", aiConfidence: 97, evolution: "Defensive" };
    case "whale":
      return { ...pool, dynamicFeeBps: 104, threat: "Elevated", liquidityHealth: 69, evolution: "Defensive" };
    case "sentiment":
      return { ...pool, sentiment: 98, dynamicFeeBps: 22, evolution: "Hyper Growth" };
    case "quest":
      return { ...pool, liquidityHealth: 91, evolution: "Legendary" };
    default:
      return pool;
  }
}

if (process.env.RUN_SIMULATOR_ONCE === "true") {
  console.log(JSON.stringify(demoScenarios.map((scenario) => runScenario(scenario.key)), null, 2));
}
