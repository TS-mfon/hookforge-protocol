export type EvolutionState =
  | "Dormant"
  | "Awakening"
  | "Hyper Growth"
  | "Frenzy"
  | "Defensive"
  | "Recovery"
  | "Legendary";

export type ModuleKey =
  | "dynamic-fees"
  | "anti-mev"
  | "twap-stability"
  | "rebalancing"
  | "sentiment"
  | "whale-defense"
  | "rewards"
  | "evolution"
  | "quests"
  | "lp-rpg";

export type AgentKey =
  | "mev-defense"
  | "volatility"
  | "liquidity"
  | "growth"
  | "sentiment"
  | "quest"
  | "governance-risk";

export type ThreatLevel = "Calm" | "Watch" | "Elevated" | "Critical";

export interface ModuleDefinition {
  key: ModuleKey;
  title: string;
  tagline: string;
  description: string;
  metrics: string[];
  actions: string[];
  guardrails: string[];
}

export interface AgentDefinition {
  key: AgentKey;
  name: string;
  role: string;
  confidence: number;
  lastAction: string;
}

export interface Quest {
  id: string;
  title: string;
  progress: number;
  reward: string;
  status: "Active" | "Completed" | "Locked";
}

export interface PoolState {
  id: string;
  name: string;
  pair: string;
  evolution: EvolutionState;
  threat: ThreatLevel;
  dynamicFeeBps: number;
  liquidityHealth: number;
  volatility: number;
  sentiment: number;
  aiConfidence: number;
  volume24h: string;
  tvl: string;
  activeModules: ModuleKey[];
  traits: string[];
}

export interface AIRecommendation {
  id: string;
  agent: AgentKey;
  poolId: string;
  title: string;
  rationale: string;
  action: string;
  confidence: number;
  bounded: boolean;
  createdAt: string;
}

export interface DemoScenario {
  key: string;
  title: string;
  trigger: string;
  expected: string;
}

export const modules: ModuleDefinition[] = [
  {
    key: "dynamic-fees",
    title: "Dynamic Fee Engine",
    tagline: "Fees that remember market stress.",
    description: "Adapts fees around volatility, toxic flow, whale pressure, liquidity depth, and growth conditions.",
    metrics: ["Risk score", "Fee memory", "Swap velocity", "Liquidity depth"],
    actions: ["Lower growth fees", "Spike defensive fees", "Apply whale tax", "Decay stress memory"],
    guardrails: ["Max fee cap", "Cooldown cap", "Governance override", "Emergency pause"]
  },
  {
    key: "anti-mev",
    title: "Anti-MEV Engine",
    tagline: "Detects hostile flow before it extracts value.",
    description: "Scores sandwich-like patterns, abnormal timing, toxic wallets, and volatility ambushes.",
    metrics: ["Toxicity", "Timing anomaly", "Wallet reputation", "Attack pressure"],
    actions: ["Activate defense mode", "Throttle swaps", "Increase fees", "Update reputation"],
    guardrails: ["No blacklist-by-default", "Bounded penalties", "Appealable reputation", "Transparent events"]
  },
  {
    key: "twap-stability",
    title: "TWAP Stability Engine",
    tagline: "Flash manipulation resistance for adaptive pools.",
    description: "Compares live swap behavior against moving averages and deviation envelopes.",
    metrics: ["TWAP deviation", "Flash volatility", "Oracle sanity", "Trade-size pressure"],
    actions: ["Limit trade size", "Increase stability fee", "Require cooldown", "Flag suspicious deviation"],
    guardrails: ["Deviation caps", "Oracle freshness", "Multi-source sanity", "Fail-closed mode"]
  },
  {
    key: "rebalancing",
    title: "Auto-Rebalancing Engine",
    tagline: "Liquidity that migrates toward useful ranges.",
    description: "Analyzes liquidity concentration and AI-predicted demand zones for capital efficiency.",
    metrics: ["Range utilization", "Depth imbalance", "Predicted demand", "LP efficiency"],
    actions: ["Recommend migration", "Defend active range", "Unlock rebalance reward", "Open governance action"],
    guardrails: ["LP opt-in", "Slippage bound", "Time delay", "Simulation required"]
  },
  {
    key: "sentiment",
    title: "Sentiment Engine",
    tagline: "Markets that respond to social weather.",
    description: "Consumes signed social signal summaries and converts sentiment into bounded market posture.",
    metrics: ["Mention velocity", "Polarity", "Influencer weight", "Community growth"],
    actions: ["Activate growth mode", "Raise defensive posture", "Reward LPs", "Flag manipulation"],
    guardrails: ["Signed oracle only", "Expiry", "Rate limits", "Manual override"]
  },
  {
    key: "whale-defense",
    title: "Whale Intelligence",
    tagline: "Detects accumulation, dumps, and concentration risk.",
    description: "Tracks whale-sized flow, concentrated ownership pressure, and coordinated movement signatures.",
    metrics: ["Whale pressure", "Dump risk", "Accumulation", "Concentration"],
    actions: ["Apply temporary tax", "Activate cooldown", "Boost LP defense rewards", "Raise alerts"],
    guardrails: ["Size thresholds", "Duration caps", "No permanent penalty", "Governance audit trail"]
  },
  {
    key: "rewards",
    title: "Reward Engine",
    tagline: "Pays useful liquidity and defensive participation.",
    description: "Allocates rewards to LPs who sustain liquidity, improve depth, and support healthy pool behavior.",
    metrics: ["Defense score", "Duration", "Efficiency", "Quest contribution"],
    actions: ["Boost LPs", "Release treasury rewards", "Mint badges", "Update leaderboard"],
    guardrails: ["Emission cap", "Treasury role", "Sybil scoring", "Quest validation"]
  },
  {
    key: "evolution",
    title: "Evolution Engine",
    tagline: "Pools visibly evolve as market organisms.",
    description: "Transitions pools across Dormant, Awakening, Hyper Growth, Frenzy, Defensive, Recovery, and Legendary states.",
    metrics: ["Milestones", "Stress memory", "Volume streak", "Defense history"],
    actions: ["Change visual state", "Unlock trait", "Tune modules", "Open special events"],
    guardrails: ["Deterministic triggers", "Event logs", "Admin reset", "No hidden state"]
  },
  {
    key: "quests",
    title: "Market Quest Engine",
    tagline: "Turns liquidity growth into coordinated objectives.",
    description: "Creates community objectives around liquidity duration, volume, healthy spreads, and LP onboarding.",
    metrics: ["Quest progress", "Participant count", "Reward pool", "Completion proof"],
    actions: ["Unlock rewards", "Upgrade visuals", "Release treasury tranche", "Grant governance rights"],
    guardrails: ["Anti-spam limits", "Milestone proofs", "Treasury caps", "Completion delay"]
  },
  {
    key: "lp-rpg",
    title: "LP RPG System",
    tagline: "LPs become market players with identity.",
    description: "Builds LP classes, badges, perks, and leaderboards around contribution quality and durability.",
    metrics: ["Duration", "Contribution", "Defense activity", "Efficiency"],
    actions: ["Assign class", "Issue badge", "Boost rewards", "Update profile"],
    guardrails: ["Non-transferable identity", "Sybil checks", "Reward caps", "Transparent formulas"]
  }
];

export const agents: AgentDefinition[] = [
  { key: "mev-defense", name: "Aegis", role: "MEV defense and toxic-flow analyst", confidence: 94, lastAction: "Recommended defensive fee memory increase" },
  { key: "volatility", name: "Pulse", role: "Volatility response strategist", confidence: 88, lastAction: "Detected fast deviation from TWAP corridor" },
  { key: "liquidity", name: "Vector", role: "Liquidity migration forecaster", confidence: 91, lastAction: "Suggested range-defense reward boost" },
  { key: "growth", name: "Ignition", role: "Growth-mode and quest activator", confidence: 86, lastAction: "Opened LP onboarding quest" },
  { key: "sentiment", name: "Signal", role: "Social sentiment interpreter", confidence: 83, lastAction: "Shifted pool posture toward bullish growth" },
  { key: "quest", name: "Atlas", role: "Market quest coordinator", confidence: 89, lastAction: "Validated healthy spread milestone" },
  { key: "governance-risk", name: "Sentinel", role: "Parameter and governance risk reviewer", confidence: 96, lastAction: "Rejected uncapped autonomy proposal" }
];

export const pools: PoolState[] = [
  {
    id: "x-usdc",
    name: "X Layer Genesis Pool",
    pair: "X/USDC",
    evolution: "Frenzy",
    threat: "Elevated",
    dynamicFeeBps: 74,
    liquidityHealth: 82,
    volatility: 68,
    sentiment: 79,
    aiConfidence: 91,
    volume24h: "$18.4M",
    tvl: "$42.7M",
    activeModules: ["dynamic-fees", "anti-mev", "twap-stability", "rebalancing", "sentiment", "whale-defense", "rewards", "evolution", "quests", "lp-rpg"],
    traits: ["Adaptive", "Defensive", "Socially aware", "Questing"]
  },
  {
    id: "eth-usdt",
    name: "Volatility Shield Pool",
    pair: "ETH/USDT",
    evolution: "Defensive",
    threat: "Critical",
    dynamicFeeBps: 112,
    liquidityHealth: 71,
    volatility: 91,
    sentiment: 45,
    aiConfidence: 95,
    volume24h: "$31.9M",
    tvl: "$66.2M",
    activeModules: ["dynamic-fees", "anti-mev", "twap-stability", "whale-defense", "rewards", "evolution"],
    traits: ["MEV-resistant", "Stress memory", "Whale-aware"]
  },
  {
    id: "meme-usdc",
    name: "Community Quest Pool",
    pair: "MEME/USDC",
    evolution: "Hyper Growth",
    threat: "Watch",
    dynamicFeeBps: 31,
    liquidityHealth: 76,
    volatility: 57,
    sentiment: 92,
    aiConfidence: 84,
    volume24h: "$7.8M",
    tvl: "$12.5M",
    activeModules: ["dynamic-fees", "sentiment", "rewards", "evolution", "quests", "lp-rpg"],
    traits: ["Viral", "Rewarding", "Social"]
  }
];

export const recommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    agent: "mev-defense",
    poolId: "x-usdc",
    title: "Defense mode activation recommended",
    rationale: "Three fast swaps entered the pool inside the timing anomaly window while volatility memory was still elevated.",
    action: "Raise fee memory by 12 points for 15 minutes.",
    confidence: 94,
    bounded: true,
    createdAt: "now"
  },
  {
    id: "rec-2",
    agent: "liquidity",
    poolId: "eth-usdt",
    title: "Range defense reward boost",
    rationale: "Depth is thinning near the active range while volume pressure is accelerating.",
    action: "Boost Guardian LP rewards by 1.4x until liquidity health returns above 80.",
    confidence: 91,
    bounded: true,
    createdAt: "2m ago"
  },
  {
    id: "rec-3",
    agent: "sentiment",
    poolId: "meme-usdc",
    title: "Growth quest expansion",
    rationale: "Mention velocity and positive sentiment crossed growth thresholds without matching liquidity depth.",
    action: "Open 1,000 LP onboarding quest and lower fees by 8 bps under cap.",
    confidence: 83,
    bounded: true,
    createdAt: "5m ago"
  }
];

export const quests: Quest[] = [
  { id: "q1", title: "Sustain healthy liquidity for 7 days", progress: 64, reward: "Guardian boost + visual trait", status: "Active" },
  { id: "q2", title: "Reach $10M protected volume", progress: 88, reward: "Fee reduction window", status: "Active" },
  { id: "q3", title: "Onboard 1,000 LPs", progress: 41, reward: "Governance access unlock", status: "Active" },
  { id: "q4", title: "Defend against high-risk volatility", progress: 100, reward: "Legendary defense badge", status: "Completed" }
];

export const demoScenarios: DemoScenario[] = [
  { key: "volatility", title: "Trigger Volatility Spike", trigger: "Rapid price movement and swap velocity surge", expected: "Dynamic fees rise, TWAP checks tighten, evolution shifts toward Defensive" },
  { key: "mev", title: "Simulate MEV-Like Flow", trigger: "Front/back timing pattern around target swap", expected: "Anti-MEV raises toxicity, activates fee memory, logs AI defense" },
  { key: "whale", title: "Whale Dump Pressure", trigger: "Large swap relative to depth", expected: "Whale module applies temporary tax and rewards defensive LPs" },
  { key: "sentiment", title: "Bullish Social Surge", trigger: "Positive sentiment and mention velocity", expected: "Growth mode opens, fees drop inside cap, quest expands" },
  { key: "quest", title: "Complete Market Quest", trigger: "Milestone threshold reached", expected: "Rewards unlock, pool gains trait, evolution timeline advances" }
];
