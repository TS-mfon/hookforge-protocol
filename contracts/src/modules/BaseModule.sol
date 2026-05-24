// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IHookForgeModule} from "../IHookForgeModule.sol";
import {HookPoint, PoolMetrics} from "../Types.sol";

abstract contract BaseModule is IHookForgeModule {
    bytes4 internal constant DECISION_OK = bytes4(keccak256("HOOKFORGE_OK"));

    function clamp(uint256 value, uint256 maxValue) internal pure returns (uint256) {
        return value > maxValue ? maxValue : value;
    }

    function onHook(HookPoint point, bytes32 poolId, address actor, PoolMetrics calldata metrics, bytes calldata data)
        external
        virtual
        returns (PoolMetrics memory updated, bytes4 decision);
}
