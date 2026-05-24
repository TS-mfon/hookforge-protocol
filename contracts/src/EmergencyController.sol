// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EmergencyController {
    address public admin;
    bool public protocolPaused;
    mapping(bytes32 => bool) public poolPaused;

    event ProtocolPauseSet(bool paused);
    event PoolPauseSet(bytes32 indexed poolId, bool paused);

    modifier onlyAdmin() {
        require(msg.sender == admin, "EMERGENCY_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setProtocolPaused(bool paused) external onlyAdmin {
        protocolPaused = paused;
        emit ProtocolPauseSet(paused);
    }

    function setPoolPaused(bytes32 poolId, bool paused) external onlyAdmin {
        poolPaused[poolId] = paused;
        emit PoolPauseSet(poolId, paused);
    }
}
