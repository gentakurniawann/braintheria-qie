// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BrainFaucetSwap
 * @dev Combined Faucet + Swap contract for BRAIN token distribution
 *
 * Features:
 * 1. Faucet: New users can claim free BRAIN tokens once
 * 2. Swap: Users can swap QIE (native token) for BRAIN
 *
 * Flow:
 * - New user → claimFaucet() → Get 100 BRAIN free (once per wallet)
 * - Existing user → swapQieForBrain() → Send QIE, receive BRAIN
 */
contract BrainFaucetSwap is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ==================== STATE ====================

    IERC20 public immutable brainToken;

    uint256 public faucetAmount = 100 * 10 ** 18; // 100 BRAIN per claim
    uint256 public swapRate = 100; // 1 QIE = 100 BRAIN

    mapping(address => bool) public hasClaimed; // Track faucet claims

    uint256 public totalFaucetClaims;
    uint256 public totalSwapped;

    // ==================== EVENTS ====================

    event FaucetClaimed(address indexed user, uint256 amount);
    event Swapped(address indexed user, uint256 qieAmount, uint256 brainAmount);
    event FaucetAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event SwapRateUpdated(uint256 oldRate, uint256 newRate);
    event TokensWithdrawn(address indexed to, uint256 amount);
    event QieWithdrawn(address indexed to, uint256 amount);

    // ==================== CONSTRUCTOR ====================

    constructor(address _brainToken, address _owner) Ownable(_owner) {
        require(_brainToken != address(0), "Invalid token address");
        brainToken = IERC20(_brainToken);
    }

    // ==================== FAUCET ====================

    /**
     * @notice Claim free BRAIN tokens (once per wallet)
     * @dev User can only claim once. Good for onboarding new users.
     */
    function claimFaucet() external nonReentrant {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(
            brainToken.balanceOf(address(this)) >= faucetAmount,
            "Faucet empty"
        );

        hasClaimed[msg.sender] = true;
        totalFaucetClaims++;

        brainToken.safeTransfer(msg.sender, faucetAmount);

        emit FaucetClaimed(msg.sender, faucetAmount);
    }

    /**
     * @notice Check if an address has claimed from faucet
     */
    function hasClaimedFaucet(address user) external view returns (bool) {
        return hasClaimed[user];
    }

    // ==================== SWAP ====================

    /**
     * @notice Swap QIE (native token) for BRAIN
     * @dev Send QIE with the transaction, receive BRAIN based on swapRate
     * Example: If swapRate = 100, sending 1 QIE gives you 100 BRAIN
     */
    function swapQieForBrain() external payable nonReentrant {
        require(msg.value > 0, "Send QIE to swap");

        uint256 brainAmount = msg.value * swapRate;
        require(
            brainToken.balanceOf(address(this)) >= brainAmount,
            "Insufficient BRAIN liquidity"
        );

        totalSwapped += brainAmount;

        brainToken.safeTransfer(msg.sender, brainAmount);

        emit Swapped(msg.sender, msg.value, brainAmount);
    }

    /**
     * @notice Calculate how much BRAIN you get for a given QIE amount
     */
    function getSwapAmount(uint256 qieAmount) external view returns (uint256) {
        return qieAmount * swapRate;
    }

    /**
     * @notice Get available BRAIN in the contract
     */
    function availableBrain() external view returns (uint256) {
        return brainToken.balanceOf(address(this));
    }

    // ==================== ADMIN ====================

    /**
     * @notice Update faucet claim amount
     */
    function setFaucetAmount(uint256 _amount) external onlyOwner {
        emit FaucetAmountUpdated(faucetAmount, _amount);
        faucetAmount = _amount;
    }

    /**
     * @notice Update swap rate (how much BRAIN per 1 QIE)
     */
    function setSwapRate(uint256 _rate) external onlyOwner {
        require(_rate > 0, "Rate must be > 0");
        emit SwapRateUpdated(swapRate, _rate);
        swapRate = _rate;
    }

    /**
     * @notice Withdraw BRAIN tokens (admin only)
     */
    function withdrawBrain(uint256 amount) external onlyOwner {
        brainToken.safeTransfer(msg.sender, amount);
        emit TokensWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Withdraw QIE collected from swaps (admin only)
     */
    function withdrawQie() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No QIE to withdraw");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");

        emit QieWithdrawn(msg.sender, balance);
    }

    // Allow contract to receive QIE
    receive() external payable {}
}
