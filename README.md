# HookForge Protocol

**A live X Layer dApp for proving adaptive Uniswap v4 hook behavior.**

HookForge is not a static DeFi dashboard. The current build is a focused, usable MVP that lets visitors connect a wallet, call a deployed hook kernel on X Layer mainnet, and inspect the real onchain output from that hook execution.

The core idea is simple:

```text
Pool creator chooses a market scenario
        -> wallet submits a transaction
        -> HookKernel executes a hook checkpoint
        -> modules update pool metrics
        -> PoolStateManager stores the new state
        -> the dApp decodes the receipt and shows the hook output
```

This proves the adaptive behavior layer before the final Uniswap v4 routed pool is initialized.

Production site:

```text
https://hookforge-protocol.vercel.app
```

GitHub:

```text
https://github.com/TS-mfon/hookforge-protocol
```

## What HookForge Is

HookForge is a programmable behavior layer for Uniswap v4-style pools. It shows how a pool can react to changing market conditions instead of behaving like a static AMM.

The current live MVP proves:

- dynamic fee adjustment,
- risk scoring,
- whale pressure detection,
- sentiment-aware state updates,
- liquidity protection checkpoints,
- quest/activity progress from hook execution,
- receipt-level proof that hook logic ran,
- honest separation between current hook proof and future fully routed v4 swaps.

The project is built around the claim:

```text
Liquidity pools should be programmable market systems, not passive swap pipes.
```

## Current Product Surface

The broad earlier dashboard sections were intentionally removed. The live site now focuses on the actual usable hook flow.

### `/`

Landing page.

Shows:

- product explanation,
- current live metrics,
- deployed contract links,
- entry points to the three working pages.

### `/use-hook`

Primary dApp surface.

Users can:

1. Connect an EIP-1193 wallet.
2. Switch or add X Layer mainnet.
3. Choose a hook scenario.
4. Submit a real transaction to the deployed `HookKernel`.
5. Wait for confirmation.
6. See decoded hook output and before/after metric deltas.

Supported scenarios:

| Scenario | Hook checkpoint | Purpose |
| --- | --- | --- |
| Whale defense check | `beforeSwap(bytes32,bytes)` | Simulates high trade pressure and updates whale/risk/fee state. |
| Volatility shock | `beforeSwap(bytes32,bytes)` | Simulates market deviation and triggers defensive fee behavior. |
| Sentiment update | `afterSwap(bytes32,bytes)` | Records a sentiment signal and recalculates pool behavior. |
| LP protection check | `afterAddLiquidity(bytes32,bytes)` | Updates LP/accounting behavior and pool health state. |

Each run shows:

- transaction hash,
- checkpoint name,
- encoded calldata,
- receipt status,
- decoded HookForge events,
- metric values before the transaction,
- metric values after the transaction,
- metric deltas,
- explorer link.

No successful output is fabricated. If a wallet rejects, the RPC fails, or the transaction reverts, the UI shows that state.

### `/proof`

Proof and inspection page.

Shows:

- deployed contract addresses,
- latest X Layer block read by the dApp,
- live pool metrics from `PoolStateManager`,
- recent HookForge events,
- receipt-level output decoding for recent transactions.

The `Load hook output` action calls the output API and decodes a specific transaction receipt.

### `/v4-route`

Technical boundary page.

Explains what is live now and what is still required for full routed Uniswap v4 swapping.

The current MVP directly calls the deployed `HookKernel` to prove adaptive behavior. Full v4 routed swaps require:

1. permission-mining a Uniswap v4 hook address,
2. deploying a v4 hook wrapper at that mined address,
3. initializing a PoolManager pool with that hook address,
4. adding liquidity,
5. routing swaps through PoolManager or Universal Router.

The app does not claim full routed v4 swapping is live until this pool exists.

## Live X Layer Deployment

Target network:

```text
Network: X Layer mainnet
Chain ID: 196
RPC: https://rpc.xlayer.tech
Explorer: https://www.oklink.com/xlayer
```

### HookForge Contracts

```text
HookKernel           0x622857b0fef3fc2adbed986194ab74eb624de5f7
PoolStateManager     0x20e312df00bffd3a4270e4efa0d396d2d0afe603
ModuleRegistry       0x4fe350f97542911ddc95ceb09510f61de05068d9
ParameterManager     0x0f36aa1064cf545eb435e33e4f23dec098362e7c
EmergencyController  0x73784e99c0e183499da4d3e8002cbd6fdadc36b2
```

### Behavior Modules

```text
DynamicFeeModule    0x7a2330a935b617ec257d8acb9c59e45cc2019bf5
AntiMEVModule       0x28696a881d57bc3ed88abe082a82934d8b82e893
TWAPModule          0xdba3b21c243e21ad31a59cf1dc20840871a066f1
RebalanceModule     0x8864ad5224738db9c8807b2796476a5cff960fc8
SentimentModule     0x84ef06cc24f573de0de694dc9ada07a56491031f
WhaleDefenseModule  0x67e043731d26a7d27c00bc3389f01162cb18007d
RewardEngine        0x5246fa2a410715f772ce2aa680ab185b01c88896
EvolutionEngine     0xabf1c35fa10b869685a819cfe6bb959bd6e2319b
QuestEngine         0xc437583f16e613b524f6607d81b628c5e5274f39
LPProfileEngine     0xcf08ca0e9db390fcd5b5ef417b8a6d190d2a7288
```

### Reference Pool Identity

The MVP uses a fixed HookForge pool id to store and read adaptive metrics:

```text
Pool ID  0x22222019d01322b7830e1d6572d2d9478cdab7c78471fa6b31eb73673595b244
Pair     WOKB/USDC
```

Token references:

```text
WOKB  0xe538905cf8410324e03A5A23C1c177a474D59b2b
USDC  0x74b7F16337b8972027F6196A17a631aC6dE26d22
```

### Uniswap v4 X Layer References

These addresses are used for the next routed-pool step:

```text
PoolManager       0x360e68faccca8ca495c1b759fd9eee466db9fb32
PositionManager   0xcf1eafc6928dc385a342e7c6491d371d2871458b
StateView         0x76fd297e2d437cd7f76d50f01afe6160f86e9990
Universal Router  0xda00ae15d3a71466517129255255db7c0c0956d3
Permit2           0x000000000022D473030F116dDEE9F6B43aC78BA3
```

## Hook Execution Flow

The dApp calls contract functions directly on `HookKernel`.

Current selectors are defined in `apps/web/lib/hook-operations.ts`:

```text
beforeSwap              0xc376f8e3
afterSwap               0xd7773101
beforeAddLiquidity      0xe30620e9
afterAddLiquidity       0xfd8e5e6b
beforeRemoveLiquidity   0x716fff6d
afterRemoveLiquidity    0xd3e7fd2f
beforeDonate            0x4e604fdd
afterDonate             0xe35faa2f
```

The calldata shape is:

```text
selector || poolId || bytes_offset || encoded_payload
```

The runner currently submits:

```text
beforeSwap(poolId, abi.encodePacked(uint256(14), uint256(100)))
beforeSwap(poolId, abi.encodePacked(uint256(32), uint256(100)))
afterSwap(poolId, abi.encodePacked(uint256(90)))
afterAddLiquidity(poolId, "")
```

The onchain hook path:

1. `HookKernel` receives a hook checkpoint call.
2. It loads the current `PoolMetrics`.
3. It executes enabled modules from `ModuleRegistry`.
4. It writes new metrics through `PoolStateManager`.
5. It emits receipt events such as:
   - `PoolMetricsUpdated`,
   - `EvolutionStateChanged`,
   - `HookExecuted`,
   - `QuestProgressed`.
6. The frontend fetches the transaction receipt and decodes these events.

## Metrics

`PoolStateManager.getMetrics(poolId)` returns the live adaptive state used by the UI.

The dApp currently renders:

| Metric | Meaning |
| --- | --- |
| `riskScore` | Composite risk level from hook/module execution. |
| `feeMemory` | Memory of recent defensive fee pressure. |
| `liquidityHealth` | Pool health score used by LP/accounting logic. |
| `volatility` | Volatility posture recorded by hook scenarios. |
| `sentiment` | Market sentiment input captured by the sentiment scenario. |
| `whalePressure` | Whale/manipulation pressure score. |
| `questProgress` | Activity progress from hook execution. |
| `dynamicFeeBps` | Current adaptive fee value in basis points. |
| `evolutionState` | Integer state mapped to labels such as Dormant, Awakening, Growth, Defensive, or Legendary. |

## API Surface

The web app exposes server routes that read X Layer directly.

### `GET /api/hook/state`

Returns:

- deployment status,
- contract addresses,
- current metrics,
- enabled modules,
- recent activity,
- latest block,
- reference pool metadata.

This endpoint is used before a hook test to capture the "before" state.

### `GET /api/activity`

Returns recent decoded HookForge events from:

- recent X Layer logs,
- known proof receipts.

### `GET /api/hook/output?tx=<hash>`

Returns decoded output for one transaction.

Response includes:

```ts
type HookTxOutput = {
  txHash: string;
  status: "confirmed" | "failed" | "pending";
  blockNumber: number | null;
  explorerUrl: string;
  events: ActivityEvent[];
  metricsAfter: HookMetrics | null;
  decodedSummary: string;
  error?: string;
};
```

This endpoint is used after wallet confirmation and by the `/proof` page.

Invalid hashes return a `400` with a clean error. Pending receipts return `status: "pending"`.

## Repository Structure

```text
apps/web
  Next.js app router frontend and API routes.

contracts
  Foundry smart contracts, deployment scripts, and tests.

packages/shared
  Shared TypeScript package used by the monorepo.

services/indexer
  Service package reserved for indexing workflows.

services/ai-engine
  Service package reserved for AI/analysis workflows.

services/simulator
  Service package reserved for simulation workflows.
```

Important frontend files:

```text
apps/web/app/page.tsx
apps/web/app/use-hook/page.tsx
apps/web/app/proof/page.tsx
apps/web/app/v4-route/page.tsx
apps/web/app/api/hook/state/route.ts
apps/web/app/api/hook/output/route.ts
apps/web/components/contract-actions.tsx
apps/web/lib/xlayer.ts
apps/web/lib/hook-operations.ts
```

Important contract files:

```text
contracts/src/HookKernel.sol
contracts/src/PoolStateManager.sol
contracts/src/ModuleRegistry.sol
contracts/src/IHookForgeModule.sol
contracts/src/XLayerHookForgeHook.sol
contracts/test/HookKernel.t.sol
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Build everything:

```bash
npm run build
```

Typecheck the web app:

```bash
npm run typecheck -w @hookforge/web
```

Build contracts:

```bash
npm run contracts:build
```

Run contract tests:

```bash
npm run contracts:test
```

## Environment Variables

The app has deployed-address defaults in `apps/web/lib/xlayer.ts`, but these can be overridden.

```text
NEXT_PUBLIC_XLAYER_RPC_URL
NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS
NEXT_PUBLIC_HOOKFORGE_STATE_MANAGER_ADDRESS
NEXT_PUBLIC_HOOKFORGE_MODULE_REGISTRY_ADDRESS
```

Deployment helper scripts read secrets from `/home/sudodave/buildenv/.env` through `scripts/env.sh`. Do not commit private keys or tokens.

## Deployment

Production is deployed to Vercel:

```bash
bash scripts/deploy-vercel.sh
```

Push to GitHub:

```bash
git push origin HEAD
```

The current production alias is:

```text
https://hookforge-protocol.vercel.app
```

## Verification Checklist

After changes, verify:

```bash
npm run build -w @hookforge/web
npm run typecheck -w @hookforge/web
```

Smoke-check routes:

```bash
curl -I https://hookforge-protocol.vercel.app/use-hook
curl -I https://hookforge-protocol.vercel.app/proof
curl -I https://hookforge-protocol.vercel.app/v4-route
```

Smoke-check live state:

```bash
curl -s https://hookforge-protocol.vercel.app/api/hook/state
```

Smoke-check receipt output:

```bash
curl -s 'https://hookforge-protocol.vercel.app/api/hook/output?tx=0x2fae17075bb517510b287f26da7e195f697ae18957ee2fcd6b72234e09faf57d'
```

Expected proof behavior:

- the route returns `status: "confirmed"`,
- decoded events include `Pool metrics updated`,
- decoded events include `Hook checkpoint`,
- `metricsAfter` contains current adaptive pool metrics.

## Known Boundary

HookForge currently proves the adaptive hook layer by calling a deployed `HookKernel` directly.

Full routed Uniswap v4 token swapping is not claimed as live yet. To enable it, the next engineering step is to deploy a v4-compatible hook wrapper at a permission-mined hook address and initialize a PoolManager pool that references that hook.

Until then, the dApp is intentionally honest:

- real wallet transactions,
- real X Layer contract reads,
- real receipt decoding,
- no fake swap routes,
- no fake activity states.

## Pitch

Most AMM pools are passive: they apply static rules and wait for traders to interact.

HookForge demonstrates a different model:

```text
Pools can adapt.
Pools can defend.
Pools can record behavior.
Pools can expose their decision trail.
```

The MVP proves the first layer of that system: users can run hook checkpoints and inspect how adaptive pool state changes onchain.
