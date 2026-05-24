// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract EvolutionEngine is BaseModule {
    function moduleKey() external pure returns (bytes32) {
        return keccak256("evolution");
    }

    function onHook(HookPoint point, bytes32, address, PoolMetrics calldata metrics, bytes calldata)
        external
        pure
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.AfterSwap || point == HookPoint.AfterAddLiquidity) {
            if (metrics.riskScore > 75) updated.evolutionState = 4;
            else if (metrics.questProgress >= 100) updated.evolutionState = 6;
            else if (metrics.sentiment > 80 && metrics.volatility > 50) updated.evolutionState = 3;
            else if (metrics.liquidityHealth > 80) updated.evolutionState = 2;
            else updated.evolutionState = 1;
        }
        return (updated, DECISION_OK);
    }
}
