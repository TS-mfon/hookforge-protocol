// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract AntiMEVModule is BaseModule {
    mapping(bytes32 => uint256) public lastSwapBlock;

    function moduleKey() external pure returns (bytes32) {
        return keccak256("anti-mev");
    }

    function onHook(HookPoint point, bytes32 poolId, address, PoolMetrics calldata metrics, bytes calldata)
        external
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.BeforeSwap) {
            if (lastSwapBlock[poolId] == block.number) {
                updated.riskScore = clamp(metrics.riskScore + 18, 100);
                updated.feeMemory = clamp(metrics.feeMemory + 12, 100);
            }
            lastSwapBlock[poolId] = block.number;
        }
        return (updated, DECISION_OK);
    }
}
