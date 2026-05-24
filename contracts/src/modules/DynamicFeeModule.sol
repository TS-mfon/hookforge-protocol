// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract DynamicFeeModule is BaseModule {
    function moduleKey() external pure returns (bytes32) {
        return keccak256("dynamic-fees");
    }

    function onHook(HookPoint point, bytes32, address, PoolMetrics calldata metrics, bytes calldata)
        external
        pure
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.BeforeSwap || point == HookPoint.AfterSwap) {
            uint256 stress = metrics.volatility + metrics.riskScore + metrics.whalePressure + metrics.feeMemory;
            updated.dynamicFeeBps = uint24(clamp(20 + stress / 5, 1_000));
            updated.feeMemory = clamp(metrics.feeMemory + metrics.riskScore / 10 + metrics.volatility / 20, 100);
        }
        return (updated, DECISION_OK);
    }
}
