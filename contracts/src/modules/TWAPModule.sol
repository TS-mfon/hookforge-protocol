// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract TWAPModule is BaseModule {
    function moduleKey() external pure returns (bytes32) {
        return keccak256("twap-stability");
    }

    function onHook(HookPoint point, bytes32, address, PoolMetrics calldata metrics, bytes calldata data)
        external
        pure
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.BeforeSwap && data.length >= 32) {
            uint256 deviation = abi.decode(data, (uint256));
            if (deviation > 8) {
                updated.riskScore = clamp(metrics.riskScore + deviation, 100);
                updated.dynamicFeeBps = uint24(clamp(metrics.dynamicFeeBps + deviation * 2, 1_000));
            }
        }
        return (updated, DECISION_OK);
    }
}
