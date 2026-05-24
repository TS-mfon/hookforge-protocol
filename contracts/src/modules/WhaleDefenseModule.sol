// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract WhaleDefenseModule is BaseModule {
    function moduleKey() external pure returns (bytes32) {
        return keccak256("whale-defense");
    }

    function onHook(HookPoint point, bytes32, address, PoolMetrics calldata metrics, bytes calldata data)
        external
        pure
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.BeforeSwap && data.length >= 64) {
            (uint256 tradeSize, uint256 depth) = abi.decode(data, (uint256, uint256));
            if (depth > 0 && tradeSize * 100 / depth > 5) {
                updated.whalePressure = clamp(metrics.whalePressure + 22, 100);
                updated.riskScore = clamp(metrics.riskScore + 12, 100);
            }
        }
        return (updated, DECISION_OK);
    }
}
