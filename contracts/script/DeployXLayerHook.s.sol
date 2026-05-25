// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {XLayerHookForgeHook} from "../src/XLayerHookForgeHook.sol";

contract DeployXLayerHook is Script {
    function run() external {
        vm.startBroadcast();
        new XLayerHookForgeHook();
        vm.stopBroadcast();
    }
}

