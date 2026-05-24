// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseModule} from "./BaseModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

contract LPProfileEngine is BaseModule {
    mapping(bytes32 => mapping(address => uint256)) public lpScore;
    event LPClassUpdated(bytes32 indexed poolId, address indexed lp, uint256 score);

    function moduleKey() external pure returns (bytes32) {
        return keccak256("lp-rpg");
    }

    function onHook(HookPoint point, bytes32 poolId, address actor, PoolMetrics calldata metrics, bytes calldata)
        external
        override
        returns (PoolMetrics memory updated, bytes4 decision)
    {
        updated = metrics;
        if (point == HookPoint.AfterAddLiquidity) {
            lpScore[poolId][actor] += 10 + metrics.liquidityHealth / 10;
            emit LPClassUpdated(poolId, actor, lpScore[poolId][actor]);
        }
        return (updated, DECISION_OK);
    }
}
