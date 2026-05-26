# HookForge Protocol

**A focused MVP for proving adaptive Uniswap v4 hook behavior.**

HookForge helps pool creators show how a Uniswap v4-style hook can make a pool react to market conditions. The live dApp is intentionally simple: connect a wallet, run a hook scenario, and watch deployed X Layer contract state change.

## What the MVP Demonstrates

- Dynamic fee response from swap pressure.
- Whale/risk scoring from `beforeSwap`.
- Sentiment-aware state updates from `afterSwap`.
- LP protection/accounting from liquidity hook checkpoints.
- Real X Layer receipts and explorer links for every hook action.
- A clear boundary between the current hook-behavior proof and the next full routed Uniswap v4 pool deployment.

## Commands

```bash
npm install
npm run build
npm run typecheck
npm run contracts:build
npm run contracts:test
```

## X Layer Mainnet Deployment

Target network: X Layer mainnet, chain ID `196`.

Uniswap v4 X Layer contracts referenced for the next routed-pool step:

```text
PoolManager       0x360e68faccca8ca495c1b759fd9eee466db9fb32
PositionManager   0xcf1eafc6928dc385a342e7c6491d371d2871458b
StateView         0x76fd297e2d437cd7f76d50f01afe6160f86e9990
Universal Router  0xda00ae15d3a71466517129255255db7c0c0956d3
Permit2           0x000000000022D473030F116dDEE9F6B43aC78BA3
```

First HookForge market target:

```text
WOKB  0xe538905cf8410324e03A5A23C1c177a474D59b2b
USDC  0x74b7F16337b8972027F6196A17a631aC6dE26d22
```

Current HookForge deployment:

```text
PoolStateManager      0x20e312df00bffd3a4270e4efa0d396d2d0afe603
ModuleRegistry        0x4fe350f97542911ddc95ceb09510f61de05068d9
ParameterManager      0x0f36aa1064cf545eb435e33e4f23dec098362e7c
EmergencyController   0x73784e99c0e183499da4d3e8002cbd6fdadc36b2
HookKernel            0x622857b0fef3fc2adbed986194ab74eb624de5f7
```

Deployed behavior modules:

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

Recent proof transaction:

```text
Volatility hook scenario  0x2fae17075bb517510b287f26da7e195f697ae18957ee2fcd6b72234e09faf57d
```

## Live dApp

Production URL:

```text
https://hookforge-protocol.vercel.app
```

The app has one core flow:

1. Connect wallet on X Layer.
2. Choose a hook scenario.
3. Confirm the transaction.
4. Watch the page refresh with live onchain metrics and receipt proof.

## Next Step: Full Routed Uniswap v4 Swaps

The current MVP proves HookForge behavior through the deployed HookKernel. Full routed Uniswap v4 swapping needs one more deployment layer:

1. Mine a Uniswap v4 hook address with the required callback permission bits.
2. Deploy a v4 hook wrapper at that mined address.
3. Initialize a WOKB/USDC v4 pool with `hooks = minedHookAddress`.
4. Add initial liquidity through PositionManager.
5. Replace scenario calls with Universal Router swap execution.

The dApp does not fake swap routing before that pool exists.
