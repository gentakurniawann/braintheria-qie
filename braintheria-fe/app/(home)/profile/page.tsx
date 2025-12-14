'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { parseAsInteger, useQueryStates } from 'nuqs';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import useAuth from '@/stores/auth';
import { useGetMyQuestions } from '@/hooks/menu/question';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PaginationCompo } from '@/components/ui/pagination';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Profile() {
  const { user, getUserCredential, integrateWallet } = useAuth();
  const { address, isConnected } = useAccount();
  const integratedWalletRef = useRef<string | null>(null);

  const [get, set] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  const { data: myQuestions } = useGetMyQuestions({
    page: get.page,
    page_size: get.limit,
  });

  const handlePageChange = ({ page, limit }: { page: number; limit: number }) => {
    set({ page });
    set({ limit });
  };

  useEffect(() => {
    getUserCredential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle wallet integration when wallet is connected
  useEffect(() => {
    const handleWalletIntegration = async () => {
      if (isConnected && address && integratedWalletRef.current !== address) {
        try {
          await integrateWallet(address);
          integratedWalletRef.current = address;
        } catch (error) {
          console.error('Failed to integrate wallet:', error);
        }
      }

      if (!isConnected) {
        try {
          await integrateWallet('');
          integratedWalletRef.current = null;
        } catch (error) {
          console.error('Failed to disconnect wallet:', error);
        }
      }
    };

    handleWalletIntegration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-3">
        <Card className="glass-background p-6 rounded-2xl w-full flex flex-col items-center gap-4">
          <Image
            src="/images/unavailable-profile.png"
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="text-center">
            <h4 className="text-lg font-bold">{user?.username}</h4>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <Separator className="my-4" />
          <ConnectButton
            chainStatus={'icon'}
            accountStatus={'avatar'}
          />
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-9">
        <Card className="glass-background p-6 rounded-2xl w-full">
          <h4 className="text-lg font-bold">My Question</h4>
          <Separator className="my-4" />
          {(myQuestions?.data || []).map((q) => (
            <div key={q.id}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src={'/images/unavailable-profile.png'}
                    alt={'unavailable-profile'}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-col sm:flex-row gap-1 sm:items-center">
                    <span className="text-sm font-medium">{q.author.name}</span>
                    <div className="hidden sm:block w-1 h-1 bg-primary rounded-full" />
                    <p className="text-xs font-normal text-slate-500">
                      {q?.createdAt && !isNaN(new Date(q.createdAt).getTime())
                        ? new Date(q.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <Badge
                    variant={
                      q?.status === 'Open'
                        ? 'open'
                        : q?.status === 'Verified'
                          ? 'success'
                          : q?.status === 'Cancelled'
                            ? 'destructive'
                            : 'default'
                    }
                    className="min-w-20"
                  >
                    {q.status}
                  </Badge>
                  <Badge variant={'default'}>
                    <p className="flex items-center gap-1 text-xs font-normal">
                      <Coins className="w-3 h-3" />+
                      {q?.bountyAmountWei && !isNaN(Number(q.bountyAmountWei))
                        ? (Number(q.bountyAmountWei) / 1e18).toFixed(4)
                        : '0.0000'}{' '}
                    </p>
                    <span className="hidden lg:block">QIE</span>
                  </Badge>
                </div>
              </div>
              <p className="text-lg font-normal mt-4 mb-6 truncate">{q.bodyMd}</p>
              <div className="flex justify-end">
                <Link href={`/question/${q.id}`}>
                  <Button
                    size={'lg'}
                    className="max-w-32"
                    variant={'outline'}
                  >
                    Detail
                  </Button>
                </Link>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
          <PaginationCompo
            meta={{
              pagination: {
                page: myQuestions?.meta?.page || 1,
                limit: myQuestions?.meta?.limit || 10,
                totalPages: myQuestions?.meta?.totalPages || 0,
                total: myQuestions?.meta?.total || 0,
                filter: myQuestions?.meta?.filter || '',
                search: myQuestions?.meta?.search || '',
              },
            }}
            onPageChange={handlePageChange}
          />
        </Card>
      </div>
    </div>
  );
}
