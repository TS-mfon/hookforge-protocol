// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

enum HookPoint {
    BeforeInitialize,
    AfterInitialize,
    BeforeSwap,
    AfterSwap,
    BeforeAddLiquidity,
    AfterAddLiquidity,
    BeforeRemoveLiquidity,
    AfterRemoveLiquidity,
    BeforeDonate,
    AfterDonate
}

struct PoolMetrics {
    uint256 riskScore;
    uint256 feeMemory;
    uint256 liquidityHealth;
    uint256 volatility;
    uint256 sentiment;
    uint256 whalePressure;
    uint256 questProgress;
    uint24 dynamicFeeBps;
    uint8 evolutionState;
}

struct ModuleConfig {
    bool enabled;
    uint256 gasLimit;
    uint8 order;
}

struct AIRecommendation {
    bytes32 poolId;
    bytes32 moduleKey;
    bytes32 action;
    uint256 value;
    uint256 confidence;
    uint256 deadline;
    uint256 nonce;
}
