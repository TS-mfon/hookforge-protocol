// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PoolMetrics} from "./Types.sol";

contract PoolStateManager {
    address public kernel;
    mapping(bytes32 => PoolMetrics) private metrics;
    mapping(bytes32 => mapping(address => uint256)) public walletReputation;

    event KernelSet(address indexed kernel);
    event PoolMetricsUpdated(bytes32 indexed poolId, uint256 riskScore, uint24 dynamicFeeBps, uint8 evolutionState);
    event WalletReputationUpdated(bytes32 indexed poolId, address indexed wallet, uint256 score);

    modifier onlyKernel() {
        require(msg.sender == kernel, "STATE_ONLY_KERNEL");
        _;
    }

    constructor() {
        kernel = msg.sender;
    }

    function setKernel(address nextKernel) external {
        require(msg.sender == kernel, "STATE_ONLY_KERNEL");
        require(nextKernel != address(0), "STATE_ZERO_KERNEL");
        kernel = nextKernel;
        emit KernelSet(nextKernel);
    }

    function getMetrics(bytes32 poolId) external view returns (PoolMetrics memory) {
        return metrics[poolId];
    }

    function setMetrics(bytes32 poolId, PoolMetrics calldata nextMetrics) external onlyKernel {
        metrics[poolId] = nextMetrics;
        emit PoolMetricsUpdated(poolId, nextMetrics.riskScore, nextMetrics.dynamicFeeBps, nextMetrics.evolutionState);
    }

    function setWalletReputation(bytes32 poolId, address wallet, uint256 score) external onlyKernel {
        walletReputation[poolId][wallet] = score;
        emit WalletReputationUpdated(poolId, wallet, score);
    }
}
