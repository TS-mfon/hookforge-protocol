# HookForge Protocol

**The Operating System for Adaptive Markets.**

HookForge is a modular behavioral layer for Uniswap v4 pools. It turns passive AMM liquidity into adaptive market organisms with dynamic fees, anti-MEV defenses, TWAP stability, AI recommendations, liquidity rebalancing, sentiment signals, whale intelligence, quests, LP RPG mechanics, and evolving pool states.

This repository is a greenfield monorepo containing:

- A modern Next.js dApp and landing page.
- Solidity contracts for the Hook Kernel and modules.
- Shared schemas for pool state, modules, AI agents, and demo scenarios.
- Indexer, AI engine, and simulator service skeletons.
- Deployment scripts for GitHub and Vercel.

## Commands

```bash
npm install
npm run build
npm run typecheck
npm run contracts:build
npm run contracts:test
```

## X Layer Mainnet Deployment Status

Target network: X Layer mainnet, chain ID `196`.

Official Uniswap v4 X Layer contracts used by the dApp:

- PoolManager: `0x360e68faccca8ca495c1b759fd9eee466db9fb32`
- PositionManager: `0xcf1eafc6928dc385a342e7c6491d371d2871458b`
- StateView: `0x76fd297e2d437cd7f76d50f01afe6160f86e9990`
- Universal Router: `0xda00ae15d3a71466517129255255db7c0c0956d3`
- Permit2: `0x000000000022D473030F116dDEE9F6B43aC78BA3`

Official X Layer token addresses used for the first HookForge pool target:

- WOKB: `0xe538905cf8410324e03A5A23C1c177a474D59b2b`
- USDC: `0x74b7F16337b8972027F6196A17a631aC6dE26d22`

The deployer loaded from `buildenv/.env` resolves to:

```text
0xEd9EDd8586b20524CafA4F568413C504C9B03172
```

Current deployment on X Layer mainnet:

```text
PoolStateManager      0x20e312df00bffd3a4270e4efa0d396d2d0afe603
ModuleRegistry        0x4fe350f97542911ddc95ceb09510f61de05068d9
ParameterManager      0x0f36aa1064cf545eb435e33e4f23dec098362e7c
EmergencyController   0x73784e99c0e183499da4d3e8002cbd6fdadc36b2
HookKernel            0x622857b0fef3fc2adbed986194ab74eb624de5f7
```

Core deployment transaction hashes:

```text
PoolStateManager      0xfe5e315c76660fc8eb2354402c1713906e8600819acfb92806679f3e682fbb60
ModuleRegistry        0x9e7d413b48d2b22b822c8780360730493dfc8df7f5d8872efb2004c01a1e14ef
ParameterManager      0xb0034fefab223743504e5ce898018e86dc210911319af05ebc5ae8d7872a7926
EmergencyController   0xa70d4ce96084258afef04a8698a522350c87929ed6d20a124927e2f9cdf9dfe9
HookKernel            0x5ea0789946213c0f466fc2c366295df0f488f43504c80d40dc95f354e97b4c4e
StateManager.setKernel 0x1d182692c4fbf8afaf562df35cd600b4ea295aa2c12dab67f24fd0a5f08c2226
```

Deployed and configured modules:

```text
DynamicFeeModule      0x7a2330a935b617ec257d8acb9c59e45cc2019bf5
AntiMEVModule         0x28696a881d57bc3ed88abe082a82934d8b82e893
TWAPModule            0xdba3b21c243e21ad31a59cf1dc20840871a066f1
RebalanceModule       0x8864ad5224738db9c8807b2796476a5cff960fc8
SentimentModule       0x84ef06cc24f573de0de694dc9ada07a56491031f
WhaleDefenseModule    0x67e043731d26a7d27c00bc3389f01162cb18007d
RewardEngine          0x5246fa2a410715f772ce2aa680ab185b01c88896
EvolutionEngine       0xabf1c35fa10b869685a819cfe6bb959bd6e2319b
QuestEngine           0xc437583f16e613b524f6607d81b628c5e5274f39
LPProfileEngine       0xcf08ca0e9db390fcd5b5ef417b8a6d190d2a7288
```

Onchain activity created for judge review:

```text
afterSwap checkpoint   0x6a3b48fd0462f9e9f5bcde3208bbbb71e92a6a37cea98fa0c3363b8f62f7628f
beforeSwap checkpoint  0x25b1767005e11a65b5802ea14b973e35b6142866949a8bf72f59d1110aeb0aee
```

Current X Layer pool metrics after test activity:

```text
poolId          0x22222019d01322b7830e1d6572d2d9478cdab7c78471fa6b31eb73673595b244
riskScore       0
feeMemory       0
liquidityHealth 75
volatility      0
sentiment       0
whalePressure   0
questProgress   2
dynamicFeeBps   20
evolutionState  1
```

Vercel production environment:

```text
NEXT_PUBLIC_XLAYER_RPC_URL=https://rpc.xlayer.tech
NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS=0x622857b0fef3fc2adbed986194ab74eb624de5f7
NEXT_PUBLIC_HOOKFORGE_STATE_MANAGER_ADDRESS=0x20e312df00bffd3a4270e4efa0d396d2d0afe603
NEXT_PUBLIC_HOOKFORGE_MODULE_REGISTRY_ADDRESS=0x4fe350f97542911ddc95ceb09510f61de05068d9
```

## Safety Model

AI can recommend and, where configured, execute bounded actions. Every action is constrained by signed payloads, expiries, nonces, parameter caps, cooldowns, module allowlists, and emergency pause controls.
