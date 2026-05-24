// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {HookKernel} from "../src/HookKernel.sol";
import {PoolStateManager} from "../src/PoolStateManager.sol";
import {ModuleRegistry} from "../src/ModuleRegistry.sol";
import {ParameterManager} from "../src/ParameterManager.sol";
import {EmergencyController} from "../src/EmergencyController.sol";
import {DynamicFeeModule} from "../src/modules/DynamicFeeModule.sol";
import {EvolutionEngine} from "../src/modules/EvolutionEngine.sol";
import {QuestEngine} from "../src/modules/QuestEngine.sol";
import {PoolMetrics} from "../src/Types.sol";

contract HookKernelTest is Test {
    HookKernel kernel;
    PoolStateManager stateManager;
    ModuleRegistry registry;
    ParameterManager parameters;
    EmergencyController emergency;
    bytes32 poolId = keccak256("X/USDC");

    function setUp() public {
        stateManager = new PoolStateManager();
        registry = new ModuleRegistry();
        parameters = new ParameterManager();
        emergency = new EmergencyController();
        kernel = new HookKernel(stateManager, registry, parameters, emergency);
        stateManager.setKernel(address(kernel));

        DynamicFeeModule fee = new DynamicFeeModule();
        EvolutionEngine evolution = new EvolutionEngine();
        QuestEngine quest = new QuestEngine();
        registry.allowModule(address(fee), true);
        registry.allowModule(address(evolution), true);
        registry.allowModule(address(quest), true);
        registry.configure(poolId, address(fee), true, 250_000, 1);
        registry.configure(poolId, address(evolution), true, 250_000, 2);
        registry.configure(poolId, address(quest), true, 250_000, 3);
    }

    function testRunsSwapAndUpdatesMetrics() public {
        PoolMetrics memory metrics = kernel.beforeSwap(poolId, "");
        assertEq(metrics.liquidityHealth, 75);
        assertGt(metrics.dynamicFeeBps, 0);
    }

    function testQuestProgressesAfterSwap() public {
        kernel.afterSwap(poolId, "");
        PoolMetrics memory metrics = stateManager.getMetrics(poolId);
        assertEq(metrics.questProgress, 2);
    }

    function testEmergencyPauseBlocksHooks() public {
        emergency.setPoolPaused(poolId, true);
        vm.expectRevert("KERNEL_POOL_PAUSED");
        kernel.beforeSwap(poolId, "");
    }
}
