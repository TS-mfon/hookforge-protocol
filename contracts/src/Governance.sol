// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Governance {
    address public admin;
    uint256 public constant TIMELOCK = 2 days;

    struct Proposal {
        bytes32 descriptionHash;
        uint256 eta;
        bool executed;
    }

    mapping(bytes32 => Proposal) public proposals;

    event ProposalQueued(bytes32 indexed id, bytes32 descriptionHash, uint256 eta);
    event ProposalExecuted(bytes32 indexed id);

    modifier onlyAdmin() {
        require(msg.sender == admin, "GOV_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function queue(bytes32 descriptionHash) external onlyAdmin returns (bytes32 id) {
        id = keccak256(abi.encode(descriptionHash, block.timestamp, block.chainid));
        proposals[id] = Proposal(descriptionHash, block.timestamp + TIMELOCK, false);
        emit ProposalQueued(id, descriptionHash, block.timestamp + TIMELOCK);
    }

    function markExecuted(bytes32 id) external onlyAdmin {
        Proposal storage proposal = proposals[id];
        require(proposal.eta != 0, "GOV_UNKNOWN");
        require(block.timestamp >= proposal.eta, "GOV_TIMELOCK");
        require(!proposal.executed, "GOV_EXECUTED");
        proposal.executed = true;
        emit ProposalExecuted(id);
    }
}
