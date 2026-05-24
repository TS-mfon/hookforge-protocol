// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract QuestEngine is BaseModule {
    event QuestProgressed(bytes32 indexed poolId, uint256 progress);

    function moduleKey() external pure returns (bytes32) {
        return keccak256("quests");
    }

    function onHook(HookPoint point, bytes32 poolId, address, PoolMetrics calldata metrics, bytes calldata)
        external
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.AfterSwap || point == HookPoint.AfterAddLiquidity) {
            updated.questProgress = clamp(metrics.questProgress + 2, 100);
            emit QuestProgressed(poolId, updated.questProgress);
        }
        return (updated, DECISION_OK);
    }
}
