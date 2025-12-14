'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Search, UserCircle2 } from 'lucide-react';

import useAuth from '@/stores/auth';
import useTheme from '@/stores/theme';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { token, logout } = useAuth();
  const { setModalQuestion } = useTheme();

  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // (Optional) add shadow when page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`w-full h-20 z-50 fixed ${scrolled ? 'glass-background-navbar shadow-md' : ''}`}
    >
      <div className=" w-full h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-row items-center justify-between gap-4">
        <Link href={'/'}>
          {!isMobile ? (
            <Image
              src="/images/braintheria-logo-full.png"
              alt="braintheria-logo"
              width={155}
              height={24}
            />
          ) : (
            <Image
              src="/images/braintheria-logo-b.png"
              alt="braintheria-logo"
              width={40}
              height={40}
            />
          )}
        </Link>
        {((pathname !== '/' && !token) || token) && (
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Search Your Question..."
              className="w-full lg:w-96 h-10 glass-background text-blue-950"
              icon={Search}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {!isMobile && (
              <Button
                className=""
                size={'lg'}
                onClick={token ? () => setModalQuestion(true) : () => router.push('/auth/sign-in')}
              >
                Ask A Question
              </Button>
            )}
          </div>
        )}
        {token ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserCircle2 className="w-8 h-8 text-blue-950 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  router.push('/profile');
                }}
              >
                Profile
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={() => logout()}
                className="!text-red-500"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div>
            <ul>
              <li>
                <Link href="/auth/sign-in">Sign In</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
