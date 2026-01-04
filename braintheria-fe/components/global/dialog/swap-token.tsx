'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';

import useTheme from '@/stores/theme';
import { useGetDepositAddress, useSwapQieForBrain, useGetFaucetInfo } from '@/hooks/use-token';

export const swapTokenFormSchema = () => {
  return z.object({
    qieAmount: z.number().positive('QIE amount must be greater than 0'),
    brainAmount: z.number().nonnegative(),
  });
};

type SwapStep = 'input' | 'sending' | 'confirming' | 'swapping' | 'success' | 'error';

export default function SwapToken() {
  const { modalSwapToken, setModalSwapToken } = useTheme();
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<SwapStep>('input');

  // Hooks
  const { data: depositData } = useGetDepositAddress();
  const { data: faucetInfo } = useGetFaucetInfo();
  const swapMutation = useSwapQieForBrain();

  // Wagmi hooks for sending QIE transaction
  const {
    sendTransaction,
    data: txHash,
    isPending: isSending,
    error: sendError,
    reset: resetSendTransaction,
  } = useSendTransaction();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const form = useForm<z.infer<ReturnType<typeof swapTokenFormSchema>>>({
    resolver: zodResolver(swapTokenFormSchema()),
    defaultValues: {
      qieAmount: 1,
      brainAmount: faucetInfo?.swapRate ?? 100,
    },
  });

  // Update brainAmount when swapRate changes
  useEffect(() => {
    if (faucetInfo?.swapRate) {
      const qieAmount = form.getValues('qieAmount');
      form.setValue('brainAmount', qieAmount * faucetInfo.swapRate);
    }
  }, [faucetInfo?.swapRate, form]);

  // Handle transaction confirmation and call backend swap API
  useEffect(() => {
    if (isConfirmed && txHash && address && step === 'confirming') {
      setStep('swapping');

      swapMutation.mutate(
        { txHash, walletAddress: address },
        {
          onSuccess: (data) => {
            setStep('success');
            toast.success(`Swap berhasil! Anda mendapat ${data.brainAmount} BRAIN`);
            setTimeout(() => {
              handleClose();
            }, 2000);
          },
          onError: (error) => {
            setStep('error');
            toast.error(error.message || 'Swap failed');
          },
        },
      );
    }
  }, [isConfirmed, txHash, address, step, swapMutation]);

  // Handle send error
  useEffect(() => {
    if (sendError) {
      setStep('error');
      toast.error(sendError.message || 'Transaction failed');
    }
  }, [sendError]);

  // Handle confirm error
  useEffect(() => {
    if (confirmError) {
      setStep('error');
      toast.error(confirmError.message || 'Transaction confirmation failed');
    }
  }, [confirmError]);

  // Update step when sending/confirming
  useEffect(() => {
    if (isSending) {
      setStep('sending');
    } else if (isConfirming && txHash) {
      setStep('confirming');
    }
  }, [isSending, isConfirming, txHash]);

  const onSubmit = async (data: z.infer<ReturnType<typeof swapTokenFormSchema>>) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!depositData?.depositAddress) {
      toast.error('Deposit address not available');
      return;
    }

    setStep('sending');

    // Send QIE to deposit address
    sendTransaction({
      to: depositData.depositAddress as `0x${string}`,
      value: parseEther(data.qieAmount.toString()),
    });
  };

  const handleClose = () => {
    setStep('input');
    resetSendTransaction();
    form.reset();
    setModalSwapToken(false);
  };

  const handleQieChange = (value: number) => {
    const rate = faucetInfo?.swapRate ?? 100;
    form.setValue('brainAmount', value * rate);
  };

  const getButtonText = () => {
    switch (step) {
      case 'sending':
        return 'Sending QIE...';
      case 'confirming':
        return 'Confirming...';
      case 'swapping':
        return 'Processing Swap...';
      case 'success':
        return '✓ Swap Complete!';
      case 'error':
        return 'Try Again';
      default:
        return 'Swap';
    }
  };

  const isButtonDisabled =
    step === 'sending' || step === 'confirming' || step === 'swapping' || step === 'success';

  return (
    <Dialog
      open={modalSwapToken}
      onOpenChange={(open) => {
        if (!open) handleClose();
        else setModalSwapToken(open);
      }}
    >
      <DialogContent className="!max-w-[348px] glass-background">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-lg font-bold">Swap QIE to BRAIN</h4>

          {/* Swap Rate Info */}
          {faucetInfo && <p className="text-sm">1 QIE ={faucetInfo.swapRate} BRAIN</p>}

          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/images/qie-coin.png"
              alt="qie-coin"
              width={100}
              height={100}
            />
            <div className="h-0.5 border-2 border-blue-950 border-dashed w-24" />
            <Image
              src="/images/brain-coin.png"
              alt="brain-coin"
              width={100}
              height={100}
            />
          </div>

          <Form {...form}>
            <form
              className="space-y-4 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <CustomField
                control={form.control}
                name="qieAmount"
                className="w-full"
                render={({ field }) => (
                  <Input
                    placeholder="QIE Amount"
                    className="glass-background text-center"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value);
                      handleQieChange(value);
                    }}
                  />
                )}
              />
              <CustomField
                control={form.control}
                name="brainAmount"
                className="w-full"
                render={({ field }) => (
                  <Input
                    placeholder="BRAIN Amount"
                    disabled
                    className="glass-background text-center"
                    {...field}
                  />
                )}
              />

              {/* Transaction Hash */}
              {txHash && step !== 'input' && (
                <p className="text-xs text-muted-foreground text-center break-all">
                  TxHash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}

              <Button
                type={step === 'error' ? 'button' : 'submit'}
                className="w-full"
                disabled={isButtonDisabled || !isConnected}
                onClick={step === 'error' ? () => setStep('input') : undefined}
              >
                {!isConnected ? 'Connect Wallet' : getButtonText()}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
