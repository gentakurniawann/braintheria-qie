import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FaucetSwapService } from '../chain/faucet-swap.service';

// DTO for responses
interface FaucetInfoResponse {
  faucetAmount: string;
  swapRate: number;
  totalAccountClaims: number;
  availableBrain: string;
  backendWallet: string;
}

interface BalanceResponse {
  address: string;
  balance: string;
  balanceFormatted: string;
}

interface SwapQuoteResponse {
  qieAmount: string;
  brainAmount: string;
  rate: number;
}

interface ClaimFaucetDto {
  walletAddress: string;
}

@Controller('faucet-swap')
export class FaucetSwapController {
  constructor(private readonly faucetSwapService: FaucetSwapService) {}

  /**
   * GET /faucet-swap/info
   * Get faucet and swap information (public)
   */
  @Get('info')
  async getInfo(): Promise<FaucetInfoResponse> {
    return await this.faucetSwapService.getStats();
  }

  /**
   * GET /faucet-swap/balance?address=0x...
   * Get BRAIN balance for a wallet (public)
   */
  @Get('balance')
  async getBalance(
    @Query('address') address: string,
  ): Promise<BalanceResponse> {
    if (!address) {
      throw new BadRequestException('Address is required');
    }

    const balance = await this.faucetSwapService.getBrainBalance(address);
    const balanceNum = BigInt(balance);
    const balanceFormatted = (Number(balanceNum) / 1e18).toFixed(4);

    return {
      address,
      balance,
      balanceFormatted: `${balanceFormatted} BRAIN`,
    };
  }

  /**
   * GET /faucet-swap/claim-status
   * Check faucet claim status for logged-in user (requires auth)
   */
  @Get('claim-status')
  @UseGuards(AuthGuard('jwt'))
  async getClaimStatus(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    return await this.faucetSwapService.getFaucetClaimStatus(userId);
  }

  /**
   * POST /faucet-swap/claim
   * Claim faucet for logged-in user (requires auth, 1 claim per account)
   */
  @Post('claim')
  @UseGuards(AuthGuard('jwt'))
  async claimFaucet(@Request() req: any, @Body() body: ClaimFaucetDto) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    if (!body.walletAddress) {
      throw new BadRequestException('walletAddress is required');
    }

    return await this.faucetSwapService.claimFaucetForAccount(
      userId,
      body.walletAddress,
    );
  }

  /**
   * GET /faucet-swap/quote?qieAmount=1000000000000000000
   * Get swap quote (how much BRAIN for given QIE) (public)
   */
  @Get('quote')
  async getSwapQuote(
    @Query('qieAmount') qieAmount: string,
  ): Promise<SwapQuoteResponse> {
    if (!qieAmount) {
      throw new BadRequestException('qieAmount is required (in wei)');
    }

    const [brainAmount, rate] = await Promise.all([
      this.faucetSwapService.getSwapAmount(qieAmount),
      this.faucetSwapService.getSwapRate(),
    ]);

    return {
      qieAmount,
      brainAmount,
      rate,
    };
  }

  // ==================== SWAP ENDPOINTS ====================

  /**
   * GET /faucet-swap/deposit-address
   * Get backend wallet address for QIE deposits (public)
   */
  @Get('deposit-address')
  async getDepositAddress() {
    const address = await this.faucetSwapService.getDepositAddress();
    return { depositAddress: address };
  }

  /**
   * POST /faucet-swap/swap
   * Swap QIE for BRAIN (requires auth)
   *
   * Flow:
   * 1. User sends QIE to deposit-address
   * 2. User calls this endpoint with txHash as proof
   * 3. Backend verifies and transfers BRAIN
   */
  @Post('swap')
  @UseGuards(AuthGuard('jwt'))
  async swapQieForBrain(
    @Request() req: any,
    @Body() body: { txHash: string; walletAddress: string },
  ) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    if (!body.txHash) {
      throw new BadRequestException(
        'txHash is required (your QIE deposit transaction)',
      );
    }

    if (!body.walletAddress) {
      throw new BadRequestException(
        'walletAddress is required (to receive BRAIN)',
      );
    }

    return await this.faucetSwapService.swapQieForBrain(
      userId,
      body.txHash,
      body.walletAddress,
    );
  }

  /**
   * GET /faucet-swap/swap-history
   * Get user's swap history (requires auth)
   */
  @Get('swap-history')
  @UseGuards(AuthGuard('jwt'))
  async getSwapHistory(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    return await this.faucetSwapService.getSwapHistory(userId);
  }

  /**
   * POST /faucet-swap/admin/set-rate
   * Update swap rate (admin only)
   */
  @Post('admin/set-rate')
  async setSwapRate(@Body('rate') rate: number) {
    if (!rate || rate <= 0) {
      throw new BadRequestException('Valid rate is required');
    }
    return await this.faucetSwapService.setSwapRate(rate);
  }

  /**
   * POST /faucet-swap/admin/set-faucet-amount
   * Update faucet amount (admin only)
   */
  @Post('admin/set-faucet-amount')
  async setFaucetAmount(@Body('amount') amount: string) {
    if (!amount) {
      throw new BadRequestException(
        'Amount is required (in BRAIN, e.g. "100")',
      );
    }
    return await this.faucetSwapService.setFaucetAmount(amount);
  }

  /**
   * POST /faucet-swap/admin/fund
   * Fund the faucet with BRAIN tokens (admin only)
   */
  @Post('admin/fund')
  async fundFaucet(@Body('amount') amount: string) {
    if (!amount) {
      throw new BadRequestException(
        'Amount is required (in BRAIN, e.g. "10000000")',
      );
    }
    return await this.faucetSwapService.fundFaucet(amount);
  }

  /**
   * POST /faucet-swap/admin/withdraw-qie
   * Withdraw collected QIE from swaps (admin only)
   */
  @Post('admin/withdraw-qie')
  async withdrawQie() {
    return await this.faucetSwapService.withdrawQie();
  }
}
