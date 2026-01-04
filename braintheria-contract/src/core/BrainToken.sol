// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BrainToken
 * @dev QIE20/ERC20 token for the Braintheria Q&A platform
 * @notice Total supply: 1,000,000,000 BRAIN (1 Billion)
 * 
 * Tokenomics:
 * - Liquidity Pool: 20% (200,000,000)
 * - Community Rewards: 30% (300,000,000)
 * - Team & Advisors: 15% (150,000,000)
 * - Ecosystem/Treasury: 20% (200,000,000)
 * - Marketing/Airdrops: 10% (100,000,000)
 * - Hackathon Prize Pool: 5% (50,000,000)
 */
contract BrainToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion BRAIN

    constructor(address initialOwner) ERC20("BRAIN", "BRAIN") Ownable(initialOwner) {
        // Mint entire supply to deployer
        _mint(initialOwner, TOTAL_SUPPLY);
    }
}
