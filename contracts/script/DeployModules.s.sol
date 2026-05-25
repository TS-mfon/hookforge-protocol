// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ModuleRegistry} from "../src/ModuleRegistry.sol";
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

contract DeployModules is Script {
    bytes32 internal constant XLAYER_WOKB_USDC_POOL_ID = keccak256("XLAYER:WOKB/USDC:HOOKFORGE");
    address internal constant XLAYER_MODULE_REGISTRY = 0x4Fe350F97542911DDc95ceb09510f61de05068d9;

    function run() external {
        ModuleRegistry registry = ModuleRegistry(XLAYER_MODULE_REGISTRY);

        vm.startBroadcast();
        _enable(registry, address(new DynamicFeeModule()), 1);
        _enable(registry, address(new AntiMEVModule()), 2);
        _enable(registry, address(new TWAPModule()), 3);
        _enable(registry, address(new RebalanceModule()), 4);
        _enable(registry, address(new SentimentModule()), 5);
        _enable(registry, address(new WhaleDefenseModule()), 6);
        _enable(registry, address(new RewardEngine()), 7);
        _enable(registry, address(new EvolutionEngine()), 8);
        _enable(registry, address(new QuestEngine()), 9);
        _enable(registry, address(new LPProfileEngine()), 10);
        vm.stopBroadcast();
    }

    function _enable(ModuleRegistry registry, address module, uint8 order) internal {
        registry.allowModule(module, true);
        registry.configure(XLAYER_WOKB_USDC_POOL_ID, module, true, 300_000, order);
    }
}
