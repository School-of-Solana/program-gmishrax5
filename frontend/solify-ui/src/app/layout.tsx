"use client";

import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';
import { useEffect } from 'react';
import { suppressHydrationWarning } from '@/utils/suppressHydrationWarning';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Suppress hydration warnings
  useEffect(() => {
    suppressHydrationWarning();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
