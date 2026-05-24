// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ModuleConfig} from "./Types.sol";

contract ModuleRegistry {
    address public admin;
    address[] public modules;
    mapping(address => bool) public allowedModule;
    mapping(bytes32 => mapping(address => ModuleConfig)) public config;

    event ModuleAllowed(address indexed module, bool allowed);
    event ModuleConfigured(bytes32 indexed poolId, address indexed module, bool enabled, uint256 gasLimit, uint8 order);

    modifier onlyAdmin() {
        require(msg.sender == admin, "REG_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function allowModule(address module, bool allowed) external onlyAdmin {
        require(module != address(0), "REG_ZERO_MODULE");
        if (!allowedModule[module] && allowed) {
            modules.push(module);
        }
        allowedModule[module] = allowed;
        emit ModuleAllowed(module, allowed);
    }

    function configure(bytes32 poolId, address module, bool enabled, uint256 gasLimit, uint8 order) external onlyAdmin {
        require(allowedModule[module], "REG_MODULE_NOT_ALLOWED");
        require(gasLimit <= 750_000, "REG_GAS_TOO_HIGH");
        config[poolId][module] = ModuleConfig(enabled, gasLimit, order);
        emit ModuleConfigured(poolId, module, enabled, gasLimit, order);
    }

    function moduleCount() external view returns (uint256) {
        return modules.length;
    }

    function getConfig(bytes32 poolId, address module) external view returns (ModuleConfig memory) {
        return config[poolId][module];
    }
}
