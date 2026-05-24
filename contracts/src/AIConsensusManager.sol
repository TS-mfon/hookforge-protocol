// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AIRecommendation} from "./Types.sol";

contract AIConsensusManager {
    address public admin;
    mapping(address => bool) public agentSigner;
    mapping(bytes32 => bool) public usedRecommendation;

    event AgentSignerSet(address indexed signer, bool allowed);
    event AIRecommendationSubmitted(bytes32 indexed digest, bytes32 indexed poolId, bytes32 moduleKey, bytes32 action, uint256 value);
    event AIRecommendationApplied(bytes32 indexed digest);

    modifier onlyAdmin() {
        require(msg.sender == admin, "AI_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
        agentSigner[msg.sender] = true;
    }

    function setAgentSigner(address signer, bool allowed) external onlyAdmin {
        agentSigner[signer] = allowed;
        emit AgentSignerSet(signer, allowed);
    }

    function submitRecommendation(AIRecommendation calldata rec) external returns (bytes32 digest) {
        require(agentSigner[msg.sender], "AI_BAD_SIGNER");
        require(block.timestamp <= rec.deadline, "AI_EXPIRED");
        digest = keccak256(abi.encode(rec.poolId, rec.moduleKey, rec.action, rec.value, rec.confidence, rec.deadline, rec.nonce, msg.sender, block.chainid));
        require(!usedRecommendation[digest], "AI_REPLAY");
        emit AIRecommendationSubmitted(digest, rec.poolId, rec.moduleKey, rec.action, rec.value);
    }

    function markApplied(bytes32 digest) external onlyAdmin {
        require(!usedRecommendation[digest], "AI_ALREADY_USED");
        usedRecommendation[digest] = true;
        emit AIRecommendationApplied(digest);
    }
}
