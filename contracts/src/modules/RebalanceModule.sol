// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract RebalanceModule is BaseModule {
    event RebalanceRecommended(bytes32 indexed poolId, uint256 liquidityHealth, uint256 volatility);

    function moduleKey() external pure returns (bytes32) {
        return keccak256("rebalancing");
    }

    function onHook(HookPoint point, bytes32 poolId, address, PoolMetrics calldata metrics, bytes calldata)
        external
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if ((point == HookPoint.AfterSwap || point == HookPoint.AfterAddLiquidity) && metrics.liquidityHealth < 75) {
            emit RebalanceRecommended(poolId, metrics.liquidityHealth, metrics.volatility);
        }
        return (updated, DECISION_OK);
    }
}
