import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useIsMobile } from '@/hooks/use-mobile';

function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer className="relative z-10 shadow-sm bg-primary text-white !bottom-0 p-6 ">
      <div className="flex flex-col justify-center items-center gap-4">
        <Link href={'/'}>
          {!isMobile ? (
            <Image
              src="/images/braintheria-logo-white-full.png"
              alt="braintheria-logo-white"
              width={155}
              height={24}
            />
          ) : (
            <Image
              src="/images/braintheria-logo-white-b.png"
              alt="braintheria-logo-white"
              width={40}
              height={40}
            />
          )}
        </Link>
        <p className="text-sm font-normal text-center">
          &copy; 2025 Made by Lunarion. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
