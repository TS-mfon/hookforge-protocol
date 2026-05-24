// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract SentimentModule is BaseModule {
    function moduleKey() external pure returns (bytes32) {
        return keccak256("sentiment");
    }

    function onHook(HookPoint point, bytes32, address, PoolMetrics calldata metrics, bytes calldata data)
        external
        pure
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if ((point == HookPoint.AfterSwap || point == HookPoint.AfterInitialize) && data.length >= 32) {
            uint256 sentiment = abi.decode(data, (uint256));
            updated.sentiment = clamp(sentiment, 100);
            if (sentiment > 75 && metrics.dynamicFeeBps > 10) {
                updated.dynamicFeeBps = metrics.dynamicFeeBps - 10;
            }
            if (sentiment < 35) {
                updated.riskScore = clamp(metrics.riskScore + 10, 100);
            }
        }
        return (updated, DECISION_OK);
    }
}
