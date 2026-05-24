// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ParameterManager {
    address public admin;
    uint24 public maxFeeBps = 1_000;
    uint256 public maxRiskScore = 100;
    uint256 public maxCooldown = 1 hours;
    uint256 public maxRewardEmission = 1_000_000 ether;

    event CapsUpdated(uint24 maxFeeBps, uint256 maxRiskScore, uint256 maxCooldown, uint256 maxRewardEmission);

    modifier onlyAdmin() {
        require(msg.sender == admin, "PARAM_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setCaps(uint24 feeBps, uint256 riskScore, uint256 cooldown, uint256 rewardEmission) external onlyAdmin {
        require(feeBps <= 2_000, "PARAM_FEE_CAP_TOO_HIGH");
        require(riskScore <= 100, "PARAM_RISK_CAP_TOO_HIGH");
        require(cooldown <= 24 hours, "PARAM_COOLDOWN_TOO_HIGH");
        maxFeeBps = feeBps;
        maxRiskScore = riskScore;
        maxCooldown = cooldown;
        maxRewardEmission = rewardEmission;
        emit CapsUpdated(feeBps, riskScore, cooldown, rewardEmission);
    }
}
