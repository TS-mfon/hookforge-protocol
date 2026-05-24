// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OracleBridge {
    address public admin;
    mapping(address => bool) public signer;
    mapping(bytes32 => uint256) public latestSignal;

    event SignerSet(address indexed signer, bool allowed);
    event SignalSubmitted(bytes32 indexed signalKey, uint256 value, address indexed signer);

    modifier onlyAdmin() {
        require(msg.sender == admin, "ORACLE_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
        signer[msg.sender] = true;
    }

    function setSigner(address who, bool allowed) external onlyAdmin {
        signer[who] = allowed;
        emit SignerSet(who, allowed);
    }

    function submitSignal(bytes32 signalKey, uint256 value) external {
        require(signer[msg.sender], "ORACLE_BAD_SIGNER");
        latestSignal[signalKey] = value;
        emit SignalSubmitted(signalKey, value, msg.sender);
    }
}
