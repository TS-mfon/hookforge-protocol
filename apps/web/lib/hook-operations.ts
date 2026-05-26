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
  payload: bigint[];
};

export const hookOperations: HookOperation[] = [
  {
    key: "beforeSwap",
    title: "Whale defense check",
    copy: "Runs beforeSwap with whale-size trade pressure so the hook raises risk, whale pressure, and defensive fees.",
    payload: [14n, 100n]
  },
  {
    key: "beforeSwap",
    title: "Volatility shock",
    copy: "Runs BeforeSwap with a high deviation input so TWAP, dynamic fee, and risk modules react onchain.",
    payload: [32n, 100n]
  },
  {
    key: "afterSwap",
    title: "Sentiment update",
    copy: "Runs afterSwap with a positive market signal so the hook records sentiment, advances activity, and recalculates fees.",
    payload: [90n]
  },
  {
    key: "afterAddLiquidity",
    title: "LP protection check",
    copy: "Runs afterAddLiquidity so the hook updates LP accounting, reward signals, and pool health state.",
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
