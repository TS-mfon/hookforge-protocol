// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {HookPoint, PoolMetrics} from "./Types.sol";

interface IHookForgeModule {
    function moduleKey() external pure returns (bytes32);
    function onHook(HookPoint point, bytes32 poolId, address actor, PoolMetrics calldata metrics, bytes calldata data)
        external
        returns (PoolMetrics memory updated, bytes4 decision);
}
