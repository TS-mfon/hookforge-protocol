// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract XLayerHookForgeHook {
    struct PoolKey {
        address currency0;
        address currency1;
        uint24 fee;
        int24 tickSpacing;
        address hooks;
    }

    struct SwapParams {
        bool zeroForOne;
        int256 amountSpecified;
        uint160 sqrtPriceLimitX96;
    }

    struct ModifyLiquidityParams {
        int24 tickLower;
        int24 tickUpper;
        int256 liquidityDelta;
        bytes32 salt;
    }

    struct PoolMetrics {
        uint256 riskScore;
        uint256 feeMemory;
        uint256 liquidityHealth;
        uint256 volatility;
        uint256 sentiment;
        uint256 whalePressure;
        uint256 questProgress;
        uint24 dynamicFeeBps;
        uint8 evolutionState;
    }

    address public immutable admin;
    bytes32 public constant XLAYER_WOKB_USDC_POOL_ID = keccak256("XLAYER:WOKB/USDC:HOOKFORGE");
    mapping(bytes32 => PoolMetrics) public metrics;
    mapping(bytes32 => uint256) public lastSwapBlock;
    mapping(bytes32 => bool) public poolPaused;
    bool public protocolPaused;

    event HookForgeCheckpoint(bytes32 indexed poolId, address indexed actor, uint8 indexed hookPoint, uint256 riskScore, uint24 dynamicFeeBps, uint8 evolutionState);
    event DefenseActivated(bytes32 indexed poolId, uint256 riskScore, uint24 dynamicFeeBps);
    event QuestProgressed(bytes32 indexed poolId, uint256 progress);
    event PauseSet(bytes32 indexed poolId, bool paused);

    modifier onlyAdmin() {
        require(msg.sender == admin, "HOOKFORGE_ONLY_ADMIN");
        _;
    }

    constructor() {
        admin = msg.sender;
        metrics[XLAYER_WOKB_USDC_POOL_ID] = PoolMetrics({
            riskScore: 12,
            feeMemory: 5,
            liquidityHealth: 84,
            volatility: 18,
            sentiment: 62,
            whalePressure: 11,
            questProgress: 8,
            dynamicFeeBps: 30,
            evolutionState: 1
        });
    }

    function beforeInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96) external returns (bytes4) {
        _checkpoint(_poolId(key), sender, 0, sqrtPriceX96 % 13);
        return msg.sig;
    }

    function afterInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, int24 tick) external returns (bytes4) {
        _checkpoint(_poolId(key), sender, 1, (sqrtPriceX96 + uint24(tick < 0 ? -tick : tick)) % 17);
        return msg.sig;
    }

    function beforeSwap(address sender, PoolKey calldata key, SwapParams calldata params, bytes calldata data)
        external
        returns (bytes4, int256, uint24)
    {
        PoolMetrics memory next = _checkpoint(_poolId(key), sender, 2, _swapStress(params, data));
        return (msg.sig, 0, next.dynamicFeeBps * 100);
    }

    function beforeSwap(bytes32 poolId, bytes calldata data) external returns (PoolMetrics memory) {
        return _checkpoint(poolId, msg.sender, 2, data.length == 0 ? 9 : uint256(uint8(data[0])));
    }

    function afterSwap(address sender, PoolKey calldata key, SwapParams calldata params, int256, bytes calldata data) external returns (bytes4, int128) {
        _checkpoint(_poolId(key), sender, 3, _swapStress(params, data) / 2 + 3);
        return (msg.sig, 0);
    }

    function beforeAddLiquidity(address sender, PoolKey calldata key, ModifyLiquidityParams calldata params, bytes calldata) external returns (bytes4) {
        uint256 lift = params.liquidityDelta > 0 ? 2 : 8;
        _checkpoint(_poolId(key), sender, 4, lift);
        return msg.sig;
    }

    function afterAddLiquidity(address sender, PoolKey calldata key, ModifyLiquidityParams calldata params, int256, int256, bytes calldata) external returns (bytes4, int256) {
        bytes32 poolId = _poolId(key);
        PoolMetrics storage current = metrics[poolId];
        if (current.liquidityHealth < 100 && params.liquidityDelta > 0) current.liquidityHealth += 1;
        _checkpoint(poolId, sender, 5, 2);
        return (msg.sig, 0);
    }

    function beforeRemoveLiquidity(address sender, PoolKey calldata key, ModifyLiquidityParams calldata, bytes calldata) external returns (bytes4) {
        _checkpoint(_poolId(key), sender, 6, 6);
        return msg.sig;
    }

    function afterRemoveLiquidity(address sender, PoolKey calldata key, ModifyLiquidityParams calldata, int256, int256, bytes calldata) external returns (bytes4, int256) {
        bytes32 poolId = _poolId(key);
        PoolMetrics storage current = metrics[poolId];
        if (current.liquidityHealth > 0) current.liquidityHealth -= 1;
        _checkpoint(poolId, sender, 7, 7);
        return (msg.sig, 0);
    }

    function beforeDonate(address sender, PoolKey calldata key, uint256 amount0, uint256 amount1, bytes calldata) external returns (bytes4) {
        _checkpoint(_poolId(key), sender, 8, (amount0 + amount1) % 11);
        return msg.sig;
    }

    function afterDonate(address sender, PoolKey calldata key, uint256 amount0, uint256 amount1, bytes calldata) external returns (bytes4) {
        _checkpoint(_poolId(key), sender, 9, (amount0 + amount1) % 7);
        return msg.sig;
    }

    function getMetrics(bytes32 poolId) external view returns (PoolMetrics memory) {
        PoolMetrics memory current = metrics[poolId];
        if (current.liquidityHealth == 0) {
            current.liquidityHealth = 75;
            current.dynamicFeeBps = 30;
            current.evolutionState = 1;
        }
        return current;
    }

    function setPoolPaused(bytes32 poolId, bool paused) external onlyAdmin {
        poolPaused[poolId] = paused;
        emit PauseSet(poolId, paused);
    }

    function setProtocolPaused(bool paused) external onlyAdmin {
        protocolPaused = paused;
        emit PauseSet(bytes32(0), paused);
    }

    function _checkpoint(bytes32 poolId, address actor, uint8 hookPoint, uint256 stress) internal returns (PoolMetrics memory current) {
        require(!protocolPaused, "HOOKFORGE_PROTOCOL_PAUSED");
        require(!poolPaused[poolId], "HOOKFORGE_POOL_PAUSED");

        current = metrics[poolId];
        if (current.liquidityHealth == 0) {
            current.liquidityHealth = 75;
            current.dynamicFeeBps = 30;
            current.sentiment = 55;
            current.evolutionState = 1;
        }

        uint256 sameBlockPenalty = lastSwapBlock[poolId] == block.number && (hookPoint == 2 || hookPoint == 3) ? 18 : 0;
        lastSwapBlock[poolId] = block.number;

        current.volatility = _cap(current.volatility + stress / 2 + sameBlockPenalty / 3, 100);
        current.riskScore = _cap(current.riskScore + stress + sameBlockPenalty, 100);
        current.feeMemory = _cap(current.feeMemory + current.riskScore / 12 + stress / 3, 100);
        current.whalePressure = _cap(current.whalePressure + stress / 4, 100);
        current.dynamicFeeBps = uint24(_cap(20 + current.riskScore / 2 + current.volatility / 3 + current.feeMemory / 4, 1_000));

        if (hookPoint == 3 || hookPoint == 5) {
            current.questProgress = _cap(current.questProgress + 2, 100);
            emit QuestProgressed(poolId, current.questProgress);
        }
        current.evolutionState = current.riskScore > 70 ? 4 : current.questProgress > 65 ? 6 : current.questProgress > 30 ? 2 : 1;

        metrics[poolId] = current;
        if (current.riskScore > 70) emit DefenseActivated(poolId, current.riskScore, current.dynamicFeeBps);
        emit HookForgeCheckpoint(poolId, actor, hookPoint, current.riskScore, current.dynamicFeeBps, current.evolutionState);
    }

    function _swapStress(SwapParams calldata params, bytes calldata data) internal pure returns (uint256 stress) {
        stress = params.amountSpecified < 0 ? uint256(-params.amountSpecified) % 23 : uint256(params.amountSpecified) % 23;
        stress += params.zeroForOne ? 4 : 6;
        if (data.length > 0) stress += uint256(uint8(data[0])) % 17;
    }

    function _poolId(PoolKey calldata key) internal pure returns (bytes32) {
        return keccak256(abi.encode(key.currency0, key.currency1, key.fee, key.tickSpacing, key.hooks));
    }

    function _cap(uint256 value, uint256 maxValue) internal pure returns (uint256) {
        return value > maxValue ? maxValue : value;
    }
}
