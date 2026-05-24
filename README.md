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

## Safety Model

AI can recommend and, where configured, execute bounded actions. Every action is constrained by signed payloads, expiries, nonces, parameter caps, cooldowns, module allowlists, and emergency pause controls.
