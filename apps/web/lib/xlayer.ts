export const XLAYER = {
  chainId: 196,
  chainIdHex: "0xc4",
  name: "X Layer",
  rpcUrl: process.env.NEXT_PUBLIC_XLAYER_RPC_URL ?? "https://rpc.xlayer.tech",
  explorer: "https://www.oklink.com/xlayer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  poolManager: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
  positionManager: "0xcf1eafc6928dc385a342e7c6491d371d2871458b",
  stateView: "0x76fd297e2d437cd7f76d50f01afe6160f86e9990",
  universalRouter: "0xda00ae15d3a71466517129255255db7c0c0956d3",
  permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  wokb: "0xe538905cf8410324e03A5A23C1c177a474D59b2b",
  usdc: "0x74b7F16337b8972027F6196A17a631aC6dE26d22"
} as const;

export const HOOKFORGE_POOL_ID = "0x22222019d01322b7830e1d6572d2d9478cdab7c78471fa6b31eb73673595b244";

export type HookMetrics = {
  riskScore: number;
  feeMemory: number;
  liquidityHealth: number;
  volatility: number;
  sentiment: number;
  whalePressure: number;
  questProgress: number;
  dynamicFeeBps: number;
  evolutionState: number;
};

export type HookDeployment = {
  chainId: number;
  hookAddress: string | null;
  stateManager: string | null;
  registry: string | null;
  poolId: string;
  deployed: boolean;
  codeSize: number;
  metrics: HookMetrics | null;
  error?: string;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function envAddress(name: string) {
  const value = process.env[name];
  if (!value || value.toLowerCase() === ZERO_ADDRESS) return null;
  return /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null;
}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const response = await fetch(XLAYER.rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    next: { revalidate: 20 }
  });
  if (!response.ok) throw new Error(`X Layer RPC returned ${response.status}`);
  const payload = await response.json() as { result?: T; error?: { message?: string } };
  if (payload.error) throw new Error(payload.error.message ?? "X Layer RPC error");
  return payload.result as T;
}

function word(hex: string, index: number) {
  if (!hex || hex === "0x" || hex.length < 2 + (index + 1) * 64) return 0n;
  return BigInt(`0x${hex.slice(2 + index * 64, 2 + (index + 1) * 64)}`);
}

function addressFromWord(hex: string) {
  if (!hex || hex === "0x" || hex.length < 66) return null;
  return `0x${hex.slice(-40)}`;
}

export async function getHookDeployment(): Promise<HookDeployment> {
  const hookAddress = envAddress("NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS");
  if (!hookAddress) {
    return {
      chainId: XLAYER.chainId,
      hookAddress: null,
      stateManager: null,
      registry: null,
      poolId: HOOKFORGE_POOL_ID,
      deployed: false,
      codeSize: 0,
      metrics: null,
      error: "NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS is not set."
    };
  }

  try {
    const code = await rpc<string>("eth_getCode", [hookAddress, "latest"]);
    const deployed = Boolean(code && code !== "0x");
    let stateManager = envAddress("NEXT_PUBLIC_HOOKFORGE_STATE_MANAGER_ADDRESS");
    const registry = envAddress("NEXT_PUBLIC_HOOKFORGE_MODULE_REGISTRY_ADDRESS");
    let metrics: HookMetrics | null = null;

    if (deployed && !stateManager) {
      try {
        const rawState = await rpc<string>("eth_call", [{ to: hookAddress, data: "0x2e716fb1" }, "latest"]);
        stateManager = addressFromWord(rawState);
      } catch {
        stateManager = null;
      }
    }

    if (deployed && stateManager) {
      const raw = await rpc<string>("eth_call", [{ to: stateManager, data: `0xe55d11d4${HOOKFORGE_POOL_ID.slice(2)}` }, "latest"]);
      metrics = {
        riskScore: Number(word(raw, 0)),
        feeMemory: Number(word(raw, 1)),
        liquidityHealth: Number(word(raw, 2)),
        volatility: Number(word(raw, 3)),
        sentiment: Number(word(raw, 4)),
        whalePressure: Number(word(raw, 5)),
        questProgress: Number(word(raw, 6)),
        dynamicFeeBps: Number(word(raw, 7)),
        evolutionState: Number(word(raw, 8))
      };
    } else if (deployed) {
      const raw = await rpc<string>("eth_call", [{ to: hookAddress, data: `0xe55d11d4${HOOKFORGE_POOL_ID.slice(2)}` }, "latest"]);
      metrics = {
        riskScore: Number(word(raw, 0)),
        feeMemory: Number(word(raw, 1)),
        liquidityHealth: Number(word(raw, 2)),
        volatility: Number(word(raw, 3)),
        sentiment: Number(word(raw, 4)),
        whalePressure: Number(word(raw, 5)),
        questProgress: Number(word(raw, 6)),
        dynamicFeeBps: Number(word(raw, 7)),
        evolutionState: Number(word(raw, 8))
      };
    }

    return {
      chainId: XLAYER.chainId,
      hookAddress,
      stateManager,
      registry,
      poolId: HOOKFORGE_POOL_ID,
      deployed,
      codeSize: deployed ? (code.length - 2) / 2 : 0,
      metrics
    };
  } catch (error) {
    return {
      chainId: XLAYER.chainId,
      hookAddress,
      stateManager: null,
      registry: null,
      poolId: HOOKFORGE_POOL_ID,
      deployed: false,
      codeSize: 0,
      metrics: null,
      error: error instanceof Error ? error.message : "Unknown X Layer connection error."
    };
  }
}
