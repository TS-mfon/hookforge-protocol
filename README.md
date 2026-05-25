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

Current deployment simulations on X Layer mainnet:

```text
DeployCore.s.sol      4,093,072 gas  requires about 0.000163722884093072 OKB
DeployModules.s.sol   run after core with HOOKFORGE_MODULE_REGISTRY_ADDRESS set
Deploy.s.sol          10,449,117 gas requires about 0.000417964690449117 OKB
DeployXLayerHook.s.sol 1,897,142 gas requires about 0.000075885681897142 OKB
```

The deployer balance checked during implementation was:

```text
0.000037794755245125 OKB
```

That balance is below the core deployment requirement and below the compact hook deployment requirement. The main contracts were simulated successfully but were not broadcast because the current balance would fail before completion and would leave no reserve for module deployment, agents, or site testing.

Recommended funding before broadcast:

```text
Minimum for core only:       0.00020 OKB
Recommended core + modules:  0.00055 OKB
Recommended with agents/tests reserve: 0.00075 OKB or more
```

Broadcast order:

```bash
source scripts/env.sh
cd contracts
forge script script/DeployCore.s.sol:DeployCore --rpc-url "$HOOKFORGE_XLAYER_RPC_URL" --private-key "$HOOKFORGE_DEPLOYER_PRIVATE_KEY" --broadcast

export HOOKFORGE_MODULE_REGISTRY_ADDRESS=<registry-from-core-broadcast>
forge script script/DeployModules.s.sol:DeployModules --rpc-url "$HOOKFORGE_XLAYER_RPC_URL" --private-key "$HOOKFORGE_DEPLOYER_PRIVATE_KEY" --broadcast
```

After deployment, set these Vercel environment variables and redeploy the site:

```text
NEXT_PUBLIC_XLAYER_RPC_URL=https://rpc.xlayer.tech
NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS=<deployed-kernel-or-hook>
NEXT_PUBLIC_HOOKFORGE_STATE_MANAGER_ADDRESS=<deployed-state-manager-if-using-core-stack>
NEXT_PUBLIC_HOOKFORGE_MODULE_REGISTRY_ADDRESS=<deployed-registry-if-using-core-stack>
```

## Safety Model

AI can recommend and, where configured, execute bounded actions. Every action is constrained by signed payloads, expiries, nonces, parameter caps, cooldowns, module allowlists, and emergency pause controls.
