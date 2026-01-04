import { Injectable, BadRequestException } from '@nestjs/common';
import { ethers } from 'ethers';
import { PrismaService } from '../common/prisma.service';
import { BRAIN_FAUCET_SWAP_ABI, BRAIN_TOKEN_ABI } from './brain.abi';

@Injectable()
export class FaucetSwapService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private faucetSwapContract: ethers.Contract;
  private brainTokenContract: ethers.Contract;

  constructor(private prisma: PrismaService) {
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.SERVER_SIGNER_PRIVATE_KEY;
    const faucetSwapAddress = process.env.FAUCET_SWAP_ADDRESS;
    const brainTokenAddress = process.env.BRAIN_TOKEN_ADDRESS;

    if (!rpcUrl) throw new Error('RPC_URL missing in .env');
    if (!privateKey)
      throw new Error('SERVER_SIGNER_PRIVATE_KEY missing in .env');
    if (!faucetSwapAddress)
      throw new Error('FAUCET_SWAP_ADDRESS missing in .env');
    if (!brainTokenAddress)
      throw new Error('BRAIN_TOKEN_ADDRESS missing in .env');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);

    this.faucetSwapContract = new ethers.Contract(
      faucetSwapAddress,
      BRAIN_FAUCET_SWAP_ABI,
      this.signer,
    );

    this.brainTokenContract = new ethers.Contract(
      brainTokenAddress,
      BRAIN_TOKEN_ABI,
      this.signer,
    );
  }

  // ==================== FAUCET CLAIM (ACCOUNT-BASED) ====================

  /**
   * Check if user account has already claimed faucet (database check)
   */
  async hasAccountClaimed(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasClaimedFaucet: true },
    });
    return user?.hasClaimedFaucet ?? false;
  }

  /**
   * Claim faucet for a user account
   * - Checks if account already claimed (database)
   * - Transfers BRAIN from contract to user's wallet
   * - Marks account as claimed in database
   */
  async claimFaucetForAccount(userId: number, walletAddress: string) {
    // 1. Get user and check if already claimed
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.hasClaimedFaucet) {
      throw new BadRequestException(
        'You have already claimed the faucet. Each account can only claim once.',
      );
    }

    if (!walletAddress) {
      throw new BadRequestException(
        'Wallet address is required to receive BRAIN tokens',
      );
    }

    // 2. Get faucet amount and check if backend wallet has enough BRAIN
    const faucetAmount = await this.faucetSwapContract.faucetAmount();
    const backendWallet = await this.signer.getAddress();
    const backendBalance =
      await this.brainTokenContract.balanceOf(backendWallet);

    if (BigInt(backendBalance) < BigInt(faucetAmount)) {
      throw new BadRequestException(
        'Faucet is currently empty. Please try again later.',
      );
    }

    // 3. Transfer BRAIN from faucet contract to user wallet
    // Note: Backend wallet needs to be owner of FaucetSwap contract
    // Alternative: Use a separate admin function or direct token transfer
    try {
      const tx = await this.brainTokenContract.transfer(
        walletAddress,
        faucetAmount,
      );
      const receipt = await tx.wait();

      // 4. Mark account as claimed in database
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          hasClaimedFaucet: true,
          faucetClaimedAt: new Date(),
          faucetTxHash: receipt.hash,
          primaryWallet: user.primaryWallet || walletAddress,
        },
      });

      return {
        success: true,
        message: 'Faucet claimed successfully!',
        txHash: receipt.hash,
        amount: ethers.formatEther(faucetAmount),
        walletAddress,
      };
    } catch (error) {
      console.error('Faucet claim failed:', error);
      throw new BadRequestException(
        'Failed to transfer BRAIN tokens. Please try again.',
      );
    }
  }

  /**
   * Get faucet claim status for an account
   */
  async getFaucetClaimStatus(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        hasClaimedFaucet: true,
        faucetClaimedAt: true,
        faucetTxHash: true,
        primaryWallet: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const faucetAmount = await this.faucetSwapContract.faucetAmount();

    return {
      hasClaimed: user.hasClaimedFaucet,
      claimedAt: user.faucetClaimedAt,
      txHash: user.faucetTxHash,
      faucetAmount: ethers.formatEther(faucetAmount),
      canClaim: !user.hasClaimedFaucet,
    };
  }

  // ==================== READ FUNCTIONS ====================

  /**
   * Check if a wallet has claimed from faucet (on-chain check)
   */
  async hasWalletClaimed(walletAddress: string): Promise<boolean> {
    return await this.faucetSwapContract.hasClaimedFaucet(walletAddress);
  }

  /**
   * Get the current faucet amount (in wei)
   */
  async getFaucetAmount(): Promise<string> {
    const amount = await this.faucetSwapContract.faucetAmount();
    return amount.toString();
  }

  /**
   * Get the current swap rate (BRAIN per 1 QIE)
   */
  async getSwapRate(): Promise<number> {
    const rate = await this.faucetSwapContract.swapRate();
    return Number(rate);
  }

  /**
   * Calculate how much BRAIN user gets for given QIE amount
   */
  async getSwapAmount(qieAmountWei: string): Promise<string> {
    const brainAmount = await this.faucetSwapContract.getSwapAmount(
      BigInt(qieAmountWei),
    );
    return brainAmount.toString();
  }

  /**
   * Get available BRAIN in the faucet/swap contract
   */
  async getAvailableBrain(): Promise<string> {
    const available = await this.faucetSwapContract.availableBrain();
    return available.toString();
  }

  /**
   * Get BRAIN balance of a wallet
   */
  async getBrainBalance(walletAddress: string): Promise<string> {
    const balance = await this.brainTokenContract.balanceOf(walletAddress);
    return balance.toString();
  }

  /**
   * Get contract statistics
   */
  async getStats() {
    const backendWallet = await this.signer.getAddress();

    const [faucetAmount, swapRate, backendBrainBalance] = await Promise.all([
      this.faucetSwapContract.faucetAmount(),
      this.faucetSwapContract.swapRate(),
      this.brainTokenContract.balanceOf(backendWallet),
    ]);

    // Also get database claim count
    const dbClaimCount = await this.prisma.user.count({
      where: { hasClaimedFaucet: true },
    });

    return {
      faucetAmount: ethers.formatEther(faucetAmount),
      swapRate: Number(swapRate),
      totalAccountClaims: dbClaimCount,
      availableBrain: ethers.formatEther(backendBrainBalance),
      backendWallet,
    };
  }

  // ==================== SWAP FUNCTIONS (BACKEND-BASED) ====================

  /**
   * Swap QIE for BRAIN via backend
   * Flow:
   * 1. User sends QIE to backend wallet (SERVER_SIGNER address)
   * 2. User calls this API with the txHash as proof
   * 3. Backend verifies the tx and transfers BRAIN to user
   */
  async swapQieForBrain(userId: number, txHash: string, walletAddress: string) {
    // 1. Check if this txHash has already been processed
    const existingSwap = await this.prisma.ledger.findFirst({
      where: { txHash, kind: 'swap' },
    });

    if (existingSwap) {
      throw new BadRequestException(
        'This transaction has already been processed',
      );
    }

    // 2. Verify the transaction on-chain
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) {
      throw new BadRequestException('Transaction not found on chain');
    }

    // Wait for confirmation if not yet confirmed
    const receipt = await tx.wait(1);
    if (!receipt || receipt.status !== 1) {
      throw new BadRequestException('Transaction failed or not confirmed');
    }

    // 3. Verify transaction details
    const backendWallet = await this.signer.getAddress();
    if (tx.to?.toLowerCase() !== backendWallet.toLowerCase()) {
      throw new BadRequestException(
        'Transaction must be sent to the backend wallet',
      );
    }

    if (!tx.value || tx.value === 0n) {
      throw new BadRequestException('Transaction has no QIE value');
    }

    // 4. Calculate BRAIN amount based on swap rate
    const swapRate = await this.faucetSwapContract.swapRate();
    const qieAmount = tx.value;
    const brainAmount = qieAmount * BigInt(swapRate);

    // 5. Check if we have enough BRAIN
    const backendBrainBalance =
      await this.brainTokenContract.balanceOf(backendWallet);
    if (BigInt(backendBrainBalance) < brainAmount) {
      throw new BadRequestException(
        'Insufficient BRAIN liquidity. Please try again later.',
      );
    }

    // 6. Transfer BRAIN to user
    try {
      const transferTx = await this.brainTokenContract.transfer(
        walletAddress,
        brainAmount,
      );
      const transferReceipt = await transferTx.wait();

      // 7. Record in ledger
      await this.prisma.ledger.create({
        data: {
          userId,
          kind: 'swap',
          amountWei: brainAmount.toString(),
          token: 'BRAIN',
          ref: `QIE:${qieAmount.toString()}`,
          txHash,
        },
      });

      return {
        success: true,
        message: 'Swap completed successfully!',
        qieAmount: ethers.formatEther(qieAmount),
        brainAmount: ethers.formatEther(brainAmount),
        swapRate: Number(swapRate),
        depositTxHash: txHash,
        transferTxHash: transferReceipt.hash,
        walletAddress,
      };
    } catch (error) {
      console.error('Swap failed:', error);
      throw new BadRequestException(
        'Failed to transfer BRAIN tokens. Please contact support.',
      );
    }
  }

  /**
   * Get backend wallet address for QIE deposits
   */
  async getDepositAddress(): Promise<string> {
    return await this.signer.getAddress();
  }

  /**
   * Get user's swap history
   */
  async getSwapHistory(userId: number) {
    const swaps = await this.prisma.ledger.findMany({
      where: { userId, kind: 'swap' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return swaps.map((swap) => ({
      id: swap.id,
      brainAmount: ethers.formatEther(swap.amountWei),
      qieAmount: swap.ref?.replace('QIE:', '') || '0',
      txHash: swap.txHash,
      createdAt: swap.createdAt,
    }));
  }

  // ==================== ADMIN FUNCTIONS ====================

  /**
   * Update faucet amount (admin only)
   */
  async setFaucetAmount(amountBrain: string) {
    const amountWei = ethers.parseEther(amountBrain);
    const tx = await this.faucetSwapContract.setFaucetAmount(amountWei);
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  /**
   * Update swap rate (admin only)
   */
  async setSwapRate(rate: number) {
    if (rate <= 0) throw new BadRequestException('Rate must be greater than 0');
    const tx = await this.faucetSwapContract.setSwapRate(rate);
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  /**
   * Withdraw BRAIN from contract (admin only)
   */
  async withdrawBrain(amountBrain: string) {
    const amountWei = ethers.parseEther(amountBrain);
    const tx = await this.faucetSwapContract.withdrawBrain(amountWei);
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  /**
   * Withdraw QIE from contract (admin only)
   */
  async withdrawQie() {
    const tx = await this.faucetSwapContract.withdrawQie();
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  /**
   * Transfer BRAIN tokens to faucet contract for liquidity
   */
  async fundFaucet(amountBrain: string) {
    const faucetSwapAddress = process.env.FAUCET_SWAP_ADDRESS;
    if (!faucetSwapAddress) throw new Error('FAUCET_SWAP_ADDRESS missing');

    const amountWei = ethers.parseEther(amountBrain);
    const tx = await this.brainTokenContract.transfer(
      faucetSwapAddress,
      amountWei,
    );
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }
}
