// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Treasury {
    address public admin;
    mapping(bytes32 => uint256) public rewardBudgets;

    event RewardBudgetSet(bytes32 indexed poolId, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "TREASURY_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setRewardBudget(bytes32 poolId, uint256 amount) external onlyAdmin {
        rewardBudgets[poolId] = amount;
        emit RewardBudgetSet(poolId, amount);
    }
}
