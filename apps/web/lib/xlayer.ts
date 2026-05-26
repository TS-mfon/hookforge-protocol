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

export const CONTRACTS = {
  hookKernel: process.env.NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS ?? "0x622857b0fef3fc2adbed986194ab74eb624de5f7",
  stateManager: process.env.NEXT_PUBLIC_HOOKFORGE_STATE_MANAGER_ADDRESS ?? "0x20e312df00bffd3a4270e4efa0d396d2d0afe603",
  moduleRegistry: process.env.NEXT_PUBLIC_HOOKFORGE_MODULE_REGISTRY_ADDRESS ?? "0x4fe350f97542911ddc95ceb09510f61de05068d9",
  parameterManager: "0x0f36aa1064cf545eb435e33e4f23dec098362e7c",
  emergencyController: "0x73784e99c0e183499da4d3e8002cbd6fdadc36b2"
} as const;

export const MODULES = [
  { key: "dynamic-fees", title: "Dynamic Fee Engine", address: "0x7a2330a935b617ec257d8acb9c59e45cc2019bf5", role: "adjusts fees from live pool stress" },
  { key: "anti-mev", title: "Anti-MEV Engine", address: "0x28696a881d57bc3ed88abe082a82934d8b82e893", role: "raises risk when toxic timing appears" },
  { key: "twap-stability", title: "TWAP Stability Engine", address: "0xdba3b21c243e21ad31a59cf1dc20840871a066f1", role: "guards against deviation and flash pressure" },
  { key: "rebalancing", title: "Auto-Rebalancing Engine", address: "0x8864ad5224738db9c8807b2796476a5cff960fc8", role: "emits rebalance recommendations from liquidity health" },
  { key: "sentiment", title: "Sentiment Engine", address: "0x84ef06cc24f573de0de694dc9ada07a56491031f", role: "accepts signed social posture inputs" },
  { key: "whale-defense", title: "Whale Intelligence", address: "0x67e043731d26a7d27c00bc3389f01162cb18007d", role: "scores whale pressure and defensive fees" },
  { key: "rewards", title: "Reward Engine", address: "0x5246fa2a410715f772ce2aa680ab185b01c88896", role: "tracks reward-side participation hooks" },
  { key: "evolution", title: "Evolution Engine", address: "0xabf1c35fa10b869685a819cfe6bb959bd6e2319b", role: "moves pools between evolution states" },
  { key: "quests", title: "Market Quest Engine", address: "0xc437583f16e613b524f6607d81b628c5e5274f39", role: "increments quest progress from real hook events" },
  { key: "lp-rpg", title: "LP RPG System", address: "0xcf08ca0e9db390fcd5b5ef417b8a6d190d2a7288", role: "records LP class progress from liquidity hooks" }
] as const;

export const HOOKFORGE_POOL_ID = "0x22222019d01322b7830e1d6572d2d9478cdab7c78471fa6b31eb73673595b244";
export const DEPLOYMENT_BLOCK = 60929800n;
const VERIFIED_ACTIVITY_TXS = [
  "0x6a3b48fd0462f9e9f5bcde3208bbbb71e92a6a37cea98fa0c3363b8f62f7628f",
  "0x25b1767005e11a65b5802ea14b973e35b6142866949a8bf72f59d1110aeb0aee"
];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const EVENT_TOPICS: Record<string, string> = {
  questProgressed: "0x2b9fedeaef0cbab8616b9f8971d0bf6f1910c0f04fde54451613ab38317f4cad",
  poolMetricsUpdated: "0xd75cd0a2ce74340b9799703aaa8d407c9917997202cb842127c894ca668ce822",
  evolutionStateChanged: "0x444aa809477678bf816d2d6aac674e5e62b18b9a7067435435dd614105e34e6a",
  hookExecuted: "0xfd6b171a3794c17e7debd04f36b75ba80e5316ff70f49a2c8510f654a4adcdfc"
};

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

export type ActivityEvent = {
  name: string;
  contract: string;
  txHash: string;
  blockNumber: number;
  logIndex: number;
  actor?: string;
  poolId?: string;
  value?: string;
};

type RpcLog = {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: string;
};

export type TerminalState = {
  deployment: HookDeployment;
  moduleCount: number;
  modules: Array<(typeof MODULES)[number] & { hasCode: boolean; registryAddress?: string | null; enabled: boolean; gasLimit: number; order: number }>;
  activity: ActivityEvent[];
  latestBlock: number;
  pool: {
    id: string;
    pair: "WOKB/USDC";
    token0: string;
    token1: string;
    source: "PoolStateManager.getMetrics";
  };
  agents: AgentStatus[];
};

export type AgentStatus = {
  key: string;
  name: string;
  wallet: string | null;
  balanceOkb: string | null;
  mode: "server" | "user";
  status: "ready" | "not-configured";
  action: string;
};

export async function rpc<T>(method: string, params: unknown[], _revalidate = 20): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(XLAYER.rpcUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`X Layer RPC returned ${response.status}`);
      const payload = await response.json() as { result?: T; error?: { message?: string } };
      if (payload.error) throw new Error(payload.error.message ?? "X Layer RPC error");
      return payload.result as T;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("X Layer RPC error");
}

export function explorerAddress(address: string) {
  return `${XLAYER.explorer}/address/${address}`;
}

export function explorerTx(hash: string) {
  return `${XLAYER.explorer}/tx/${hash}`;
}

export function metricThreat(metrics: HookMetrics | null) {
  const risk = metrics?.riskScore ?? 0;
  if (risk >= 75) return "Critical";
  if (risk >= 50) return "Elevated";
  if (risk >= 25) return "Watch";
  return "Calm";
}

export function evolutionLabel(value: number | undefined) {
  return ["Dormant", "Awakening", "Growth", "Frenzy", "Defensive", "Recovery", "Legendary"][value ?? 0] ?? "Unknown";
}

function envAddress(name: string) {
  const value = process.env[name];
  if (!value || value.toLowerCase() === ZERO_ADDRESS) return null;
  return /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null;
}

function word(hex: string, index: number) {
  if (!hex || hex === "0x" || hex.length < 2 + (index + 1) * 64) return 0n;
  return BigInt(`0x${hex.slice(2 + index * 64, 2 + (index + 1) * 64)}`);
}

function hexToNumber(hex: string) {
  return Number(BigInt(hex));
}

function toHex(value: bigint) {
  return `0x${value.toString(16)}`;
}

function addressFromWord(hex: string) {
  if (!hex || hex === "0x" || hex.length < 66) return null;
  return `0x${hex.slice(-40)}`;
}

function topicAddress(topic?: string) {
  return topic ? `0x${topic.slice(-40)}` : undefined;
}

function decodeUint(hex: string, index = 0) {
  return word(hex, index).toString();
}

export async function getHookDeployment(): Promise<HookDeployment> {
  const hookAddress = envAddress("NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS") ?? CONTRACTS.hookKernel;
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
    let stateManager: string | null = envAddress("NEXT_PUBLIC_HOOKFORGE_STATE_MANAGER_ADDRESS") ?? CONTRACTS.stateManager;
    const registry = envAddress("NEXT_PUBLIC_HOOKFORGE_MODULE_REGISTRY_ADDRESS") ?? CONTRACTS.moduleRegistry;
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
      metrics = decodeMetrics(raw);
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
      stateManager: CONTRACTS.stateManager,
      registry: CONTRACTS.moduleRegistry,
      poolId: HOOKFORGE_POOL_ID,
      deployed: false,
      codeSize: 0,
      metrics: null,
      error: error instanceof Error ? error.message : "Unknown X Layer connection error."
    };
  }
}

export async function getActivity(limit = 25): Promise<ActivityEvent[]> {
  const latestHex = await rpc<string>("eth_blockNumber", [], 8);
  const latest = BigInt(latestHex);
  const from = latest > 99n ? latest - 99n : 0n;
  const addresses = [CONTRACTS.hookKernel, CONTRACTS.stateManager, ...MODULES.map((item) => item.address)];
  const recentLogs = await Promise.all(addresses.map((address) => rpc<RpcLog[]>("eth_getLogs", [{
    fromBlock: toHex(from),
    toBlock: "latest",
    address
  }], 8).catch(() => [])));
  const receiptLogs = await Promise.all(VERIFIED_ACTIVITY_TXS.map(async (hash) => {
    const receipt = await rpc<{ logs?: RpcLog[] } | null>("eth_getTransactionReceipt", [hash], 120).catch(() => null);
    return receipt?.logs ?? [];
  }));
  const seen = new Set<string>();

  return [...recentLogs.flat(), ...receiptLogs.flat()]
    .map((log) => decodeActivity(log))
    .filter((item): item is ActivityEvent => Boolean(item))
    .filter((item) => {
      const key = `${item.txHash}-${item.logIndex}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.blockNumber - a.blockNumber || b.logIndex - a.logIndex)
    .slice(0, limit);
}

export async function getModuleRegistryState() {
  const countRaw = await rpc<string>("eth_call", [{ to: CONTRACTS.moduleRegistry, data: "0x334f7ac5" }, "latest"]);
  const moduleCount = Number(word(countRaw, 0));
  const registryModules = await Promise.all(Array.from({ length: moduleCount }, async (_, index) => {
    const indexHex = index.toString(16).padStart(64, "0");
    return addressFromWord(await rpc<string>("eth_call", [{ to: CONTRACTS.moduleRegistry, data: `0x81b2248a${indexHex}` }, "latest"]));
  }));
  const codeByAddress = await Promise.all(MODULES.map((module) => rpc<string>("eth_getCode", [module.address, "latest"]).then((code) => code !== "0x")));
  return {
    moduleCount,
    modules: MODULES.map((module, index) => ({
      ...module,
      hasCode: codeByAddress[index],
      registryAddress: registryModules[index] ?? null,
      enabled: registryModules.some((address) => address?.toLowerCase() === module.address.toLowerCase()),
      gasLimit: 300000,
      order: index + 1
    }))
  };
}

export async function getAgents(): Promise<AgentStatus[]> {
  const configuredWallets = [
    envAddress("HOOKFORGE_AGENT_MEV_ADDRESS"),
    envAddress("HOOKFORGE_AGENT_VOLATILITY_ADDRESS"),
    envAddress("HOOKFORGE_AGENT_LIQUIDITY_ADDRESS"),
    envAddress("HOOKFORGE_AGENT_GROWTH_ADDRESS")
  ];
  const labels = [
    ["mev-defense", "MEV Defense Agent", "Runs beforeSwap checkpoints when toxic flow needs testing."],
    ["volatility", "Volatility Agent", "Runs swap stress checkpoints and records metric changes."],
    ["liquidity", "Liquidity Agent", "Runs LP checkpoint scenarios and watches liquidity health."],
    ["growth", "Growth Agent", "Runs sentiment and quest checkpoints after adaptive swap activity."]
  ] as const;
  return Promise.all(labels.map(async ([key, name, action], index) => {
    const wallet = configuredWallets[index];
    const balance = wallet ? await rpc<string>("eth_getBalance", [wallet, "latest"]).catch(() => null) : null;
    return {
      key,
      name,
      wallet,
      balanceOkb: balance ? formatEther(balance) : null,
      mode: wallet ? "server" : "user",
      status: wallet ? "ready" : "not-configured",
      action
    };
  }));
}

export async function getTerminalState(): Promise<TerminalState> {
  const [deployment, registry, activity, latestHex, agents] = await Promise.all([
    getHookDeployment(),
    getModuleRegistryState().catch(() => ({ moduleCount: 0, modules: MODULES.map((module, index) => ({ ...module, hasCode: false, registryAddress: null, enabled: false, gasLimit: 0, order: index + 1 })) })),
    getActivity(30).catch(() => []),
    rpc<string>("eth_blockNumber", [], 8).catch(() => "0x0"),
    getAgents().catch(() => [])
  ]);

  return {
    deployment,
    moduleCount: registry.moduleCount,
    modules: registry.modules,
    activity,
    latestBlock: hexToNumber(latestHex),
    pool: {
      id: HOOKFORGE_POOL_ID,
      pair: "WOKB/USDC",
      token0: XLAYER.wokb,
      token1: XLAYER.usdc,
      source: "PoolStateManager.getMetrics"
    },
    agents
  };
}

function decodeMetrics(raw: string): HookMetrics {
  return {
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

function decodeActivity(log: { address: string; topics: string[]; data: string; blockNumber: string; transactionHash: string; logIndex: string }): ActivityEvent | null {
  const topic = log.topics[0];
  const blockNumber = hexToNumber(log.blockNumber);
  const logIndex = hexToNumber(log.logIndex);
  if (topic === EVENT_TOPICS.hookExecuted) {
    return {
      name: `Hook checkpoint ${Number(word(log.topics[2] ?? "0x0", 0))}`,
      contract: log.address,
      txHash: log.transactionHash,
      blockNumber,
      logIndex,
      poolId: log.topics[1],
      actor: topicAddress(log.topics[3]),
      value: decodeUint(log.data)
    };
  }
  if (topic === EVENT_TOPICS.questProgressed) {
    return {
      name: "Quest progressed",
      contract: log.address,
      txHash: log.transactionHash,
      blockNumber,
      logIndex,
      poolId: log.topics[1],
      value: decodeUint(log.data)
    };
  }
  if (topic === EVENT_TOPICS.poolMetricsUpdated) {
    return {
      name: "Pool metrics updated",
      contract: log.address,
      txHash: log.transactionHash,
      blockNumber,
      logIndex,
      poolId: log.topics[1],
      value: `${decodeUint(log.data, 0)} risk / ${decodeUint(log.data, 1)} bps`
    };
  }
  if (topic === EVENT_TOPICS.evolutionStateChanged) {
    return {
      name: "Evolution state changed",
      contract: log.address,
      txHash: log.transactionHash,
      blockNumber,
      logIndex,
      poolId: log.topics[1],
      value: evolutionLabel(Number(word(log.data, 0)))
    };
  }
  return null;
}

function formatEther(hexWei: string) {
  const wei = BigInt(hexWei);
  const whole = wei / 10n ** 18n;
  const fraction = (wei % 10n ** 18n).toString().padStart(18, "0").slice(0, 6);
  return `${whole}.${fraction}`;
}
