// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/core/BrainFaucetSwap.sol";
import "../src/core/BrainToken.sol";

/**
 * @title DeployBrainFaucetSwap
 * @dev Deployment script for BrainFaucetSwap contract
 *
 * Prerequisites:
 *   - BRAIN token must be deployed first
 *   - Set BRAIN_TOKEN_ADDRESS in .env
 *
 * Usage:
 *   forge script script/DeployBrainFaucetSwap.s.sol:DeployBrainFaucetSwap \
 *     --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
 */
contract DeployBrainFaucetSwap is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // BRAIN token address - UPDATE THIS!
        address brainTokenAddress = vm.envAddress("BRAIN_TOKEN_ADDRESS");

        console.log("Deploying BrainFaucetSwap...");
        console.log("Deployer:", deployer);
        console.log("BRAIN Token:", brainTokenAddress);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy FaucetSwap contract
        BrainFaucetSwap faucetSwap = new BrainFaucetSwap(
            brainTokenAddress,
            deployer
        );

        vm.stopBroadcast();

        // Log results
        console.log("==========================================");
        console.log("BrainFaucetSwap deployed successfully!");
        console.log("==========================================");
        console.log("Contract Address:", address(faucetSwap));
        console.log(
            "Faucet Amount:",
            faucetSwap.faucetAmount() / 10 ** 18,
            "BRAIN"
        );
        console.log("Swap Rate: 1 QIE =", faucetSwap.swapRate(), "BRAIN");
        console.log("==========================================");
        console.log("");
        console.log("NEXT STEPS:");
        console.log("1. Transfer BRAIN tokens to the FaucetSwap contract");
        console.log("   Example: 10,000,000 BRAIN for faucet + swap liquidity");
        console.log("");
        console.log("2. Command to transfer BRAIN:");
        console.log("   cast send", brainTokenAddress);
        console.log(
            "   'transfer(address,uint256)'",
            address(faucetSwap),
            "10000000000000000000000000"
        );
        console.log("==========================================");
    }
}
