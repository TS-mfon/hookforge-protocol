import { HOOKFORGE_POOL_ID } from "./xlayer";

export const hookSelectors = {
  beforeSwap: "0xc376f8e3",
  afterSwap: "0xd7773101",
  beforeAddLiquidity: "0xe30620e9",
  afterAddLiquidity: "0xfd8e5e6b",
  beforeRemoveLiquidity: "0x716fff6d",
  afterRemoveLiquidity: "0xd3e7fd2f",
  beforeDonate: "0x4e604fdd",
  afterDonate: "0xe35faa2f"
} as const;

export type HookOperationKey = keyof typeof hookSelectors;

export type HookOperation = {
  key: HookOperationKey;
  title: string;
  copy: string;
  agent: "mev-defense" | "volatility" | "liquidity" | "growth";
  payload: bigint[];
};

export const hookOperations: HookOperation[] = [
  {
    key: "beforeSwap",
    title: "MEV defense scan",
    copy: "Runs BeforeSwap with TWAP deviation and whale-size inputs, raising risk and defensive fees when the flow is toxic.",
    agent: "mev-defense",
    payload: [14n, 100n]
  },
  {
    key: "beforeSwap",
    title: "Volatility shock",
    copy: "Runs BeforeSwap with a high deviation input so TWAP, dynamic fee, and risk modules react onchain.",
    agent: "volatility",
    payload: [32n, 100n]
  },
  {
    key: "afterSwap",
    title: "Bullish sentiment close",
    copy: "Runs AfterSwap with a positive sentiment signal, advancing quests and letting evolution logic recalculate state.",
    agent: "growth",
    payload: [90n]
  },
  {
    key: "beforeAddLiquidity",
    title: "LP safety preflight",
    copy: "Runs the add-liquidity guard before capital enters the adaptive pool.",
    agent: "liquidity",
    payload: []
  },
  {
    key: "afterAddLiquidity",
    title: "Update LP profile",
    copy: "Runs LP RPG, rewards, rebalancing, and quest accounting after liquidity is added.",
    agent: "liquidity",
    payload: []
  },
  {
    key: "beforeRemoveLiquidity",
    title: "Liquidity exit defense",
    copy: "Runs the defensive checkpoint before liquidity leaves the pool.",
    agent: "liquidity",
    payload: []
  }
];

function word(value: bigint) {
  return value.toString(16).padStart(64, "0");
}

function encodeBytes(words: bigint[]) {
  return `${word(BigInt(words.length * 32))}${words.map(word).join("")}`;
}

export function hookCalldata(operation: HookOperationKey, payload: bigint[] = []) {
  return `${hookSelectors[operation]}${HOOKFORGE_POOL_ID.slice(2)}${word(64n)}${encodeBytes(payload)}`;
}

export function findOperation(titleOrKey: string) {
  return hookOperations.find((operation) => operation.title === titleOrKey || operation.key === titleOrKey);
}
