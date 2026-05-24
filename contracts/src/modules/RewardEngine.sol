// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract RewardEngine is BaseModule {
    event RewardBoostActivated(bytes32 indexed poolId, uint256 liquidityHealth, uint256 riskScore);

    function moduleKey() external pure returns (bytes32) {
        return keccak256("rewards");
    }

    function onHook(HookPoint point, bytes32 poolId, address, PoolMetrics calldata metrics, bytes calldata)
        external
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.AfterAddLiquidity && (metrics.riskScore > 55 || metrics.liquidityHealth < 70)) {
            emit RewardBoostActivated(poolId, metrics.liquidityHealth, metrics.riskScore);
        }
        return (updated, DECISION_OK);
    }
}
