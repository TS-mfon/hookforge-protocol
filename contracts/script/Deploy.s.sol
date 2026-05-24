// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {PoolStateManager} from "../src/PoolStateManager.sol";
import {ModuleRegistry} from "../src/ModuleRegistry.sol";
import {ParameterManager} from "../src/ParameterManager.sol";
import {EmergencyController} from "../src/EmergencyController.sol";
import {HookKernel} from "../src/HookKernel.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        PoolStateManager stateManager = new PoolStateManager();
        ModuleRegistry registry = new ModuleRegistry();
        ParameterManager parameters = new ParameterManager();
        EmergencyController emergency = new EmergencyController();
        HookKernel kernel = new HookKernel(stateManager, registry, parameters, emergency);
        stateManager.setKernel(address(kernel));
        vm.stopBroadcast();
    }
}
