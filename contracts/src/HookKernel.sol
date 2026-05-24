// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PoolStateManager} from "./PoolStateManager.sol";
import {ModuleRegistry} from "./ModuleRegistry.sol";
import {ParameterManager} from "./ParameterManager.sol";
import {EmergencyController} from "./EmergencyController.sol";
import {IHookForgeModule} from "./IHookForgeModule.sol";
import {HookPoint, PoolMetrics, ModuleConfig} from "./Types.sol";

contract HookKernel {
    PoolStateManager public immutable stateManager;
    ModuleRegistry public immutable registry;
    ParameterManager public immutable parameters;
    EmergencyController public immutable emergency;

    event HookExecuted(bytes32 indexed poolId, HookPoint indexed point, address indexed actor, uint256 modulesExecuted);
    event ModuleExecutionFailed(bytes32 indexed poolId, HookPoint indexed point, address indexed module);
    event DefenseActivated(bytes32 indexed poolId, uint256 riskScore, uint24 dynamicFeeBps);
    event EvolutionStateChanged(bytes32 indexed poolId, uint8 evolutionState);

    constructor(PoolStateManager stateManager_, ModuleRegistry registry_, ParameterManager parameters_, EmergencyController emergency_) {
        stateManager = stateManager_;
        registry = registry_;
        parameters = parameters_;
        emergency = emergency_;
    }

    function beforeInitialize(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.BeforeInitialize, poolId, msg.sender, data);
    }

    function afterInitialize(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.AfterInitialize, poolId, msg.sender, data);
    }

    function beforeSwap(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.BeforeSwap, poolId, msg.sender, data);
    }

    function afterSwap(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.AfterSwap, poolId, msg.sender, data);
    }

    function beforeAddLiquidity(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.BeforeAddLiquidity, poolId, msg.sender, data);
    }

    function afterAddLiquidity(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.AfterAddLiquidity, poolId, msg.sender, data);
    }

    function beforeRemoveLiquidity(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.BeforeRemoveLiquidity, poolId, msg.sender, data);
    }

    function afterRemoveLiquidity(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.AfterRemoveLiquidity, poolId, msg.sender, data);
    }

    function beforeDonate(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.BeforeDonate, poolId, msg.sender, data);
    }

    function afterDonate(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _run(HookPoint.AfterDonate, poolId, msg.sender, data);
    }

    function _run(HookPoint point, bytes32 poolId, address actor, bytes calldata data) internal returns (PoolMetrics memory metrics) {
        require(!emergency.protocolPaused(), "KERNEL_PROTOCOL_PAUSED");
        require(!emergency.poolPaused(poolId), "KERNEL_POOL_PAUSED");

        metrics = stateManager.getMetrics(poolId);
        if (metrics.liquidityHealth == 0) {
            metrics.liquidityHealth = 75;
            metrics.dynamicFeeBps = 30;
        }

        uint256 count = registry.moduleCount();
        uint256 executed;
        for (uint256 i; i < count; i++) {
            address module = registry.modules(i);
            ModuleConfig memory cfg = registry.getConfig(poolId, module);
            if (!cfg.enabled) continue;
            try IHookForgeModule(module).onHook{gas: cfg.gasLimit}(point, poolId, actor, metrics, data) returns (PoolMetrics memory updated, bytes4) {
                metrics = _cap(updated);
                executed++;
            } catch {
                emit ModuleExecutionFailed(poolId, point, module);
            }
        }

        stateManager.setMetrics(poolId, metrics);
        if (metrics.riskScore > 70) emit DefenseActivated(poolId, metrics.riskScore, metrics.dynamicFeeBps);
        emit EvolutionStateChanged(poolId, metrics.evolutionState);
        emit HookExecuted(poolId, point, actor, executed);
    }

    function _cap(PoolMetrics memory metrics) internal view returns (PoolMetrics memory) {
        if (metrics.riskScore > parameters.maxRiskScore()) metrics.riskScore = parameters.maxRiskScore();
        if (metrics.dynamicFeeBps > parameters.maxFeeBps()) metrics.dynamicFeeBps = parameters.maxFeeBps();
        if (metrics.liquidityHealth > 100) metrics.liquidityHealth = 100;
        if (metrics.volatility > 100) metrics.volatility = 100;
        if (metrics.sentiment > 100) metrics.sentiment = 100;
        if (metrics.whalePressure > 100) metrics.whalePressure = 100;
        if (metrics.questProgress > 100) metrics.questProgress = 100;
        if (metrics.evolutionState > 6) metrics.evolutionState = 6;
        return metrics;
    }
}
