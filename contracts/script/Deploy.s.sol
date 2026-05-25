// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {PoolStateManager} from "../src/PoolStateManager.sol";
import {ModuleRegistry} from "../src/ModuleRegistry.sol";
import {ParameterManager} from "../src/ParameterManager.sol";
import {EmergencyController} from "../src/EmergencyController.sol";
import {HookKernel} from "../src/HookKernel.sol";
import {DynamicFeeModule} from "../src/modules/DynamicFeeModule.sol";
import {AntiMEVModule} from "../src/modules/AntiMEVModule.sol";
import {TWAPModule} from "../src/modules/TWAPModule.sol";
import {RebalanceModule} from "../src/modules/RebalanceModule.sol";
import {SentimentModule} from "../src/modules/SentimentModule.sol";
import {WhaleDefenseModule} from "../src/modules/WhaleDefenseModule.sol";
import {RewardEngine} from "../src/modules/RewardEngine.sol";
import {EvolutionEngine} from "../src/modules/EvolutionEngine.sol";
import {QuestEngine} from "../src/modules/QuestEngine.sol";
import {LPProfileEngine} from "../src/modules/LPProfileEngine.sol";

contract Deploy is Script {
    bytes32 internal constant XLAYER_WOKB_USDC_POOL_ID = keccak256("XLAYER:WOKB/USDC:HOOKFORGE");

    function run() external {
        vm.startBroadcast();
        PoolStateManager stateManager = new PoolStateManager();
        ModuleRegistry registry = new ModuleRegistry();
        ParameterManager parameters = new ParameterManager();
        EmergencyController emergency = new EmergencyController();
        HookKernel kernel = new HookKernel(stateManager, registry, parameters, emergency);
        stateManager.setKernel(address(kernel));

        DynamicFeeModule dynamicFee = new DynamicFeeModule();
        AntiMEVModule antiMev = new AntiMEVModule();
        TWAPModule twap = new TWAPModule();
        RebalanceModule rebalance = new RebalanceModule();
        SentimentModule sentiment = new SentimentModule();
        WhaleDefenseModule whaleDefense = new WhaleDefenseModule();
        RewardEngine rewards = new RewardEngine();
        EvolutionEngine evolution = new EvolutionEngine();
        QuestEngine quests = new QuestEngine();
        LPProfileEngine lpRpg = new LPProfileEngine();

        _enable(registry, address(dynamicFee), 1);
        _enable(registry, address(antiMev), 2);
        _enable(registry, address(twap), 3);
        _enable(registry, address(rebalance), 4);
        _enable(registry, address(sentiment), 5);
        _enable(registry, address(whaleDefense), 6);
        _enable(registry, address(rewards), 7);
        _enable(registry, address(evolution), 8);
        _enable(registry, address(quests), 9);
        _enable(registry, address(lpRpg), 10);
        vm.stopBroadcast();

    }

    function _enable(ModuleRegistry registry, address module, uint8 order) internal {
        registry.allowModule(module, true);
        registry.configure(XLAYER_WOKB_USDC_POOL_ID, module, true, 300_000, order);
    }
}
