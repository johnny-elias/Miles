import './globals.css';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Providers from '../components/Providers';
import AuthButton from '../components/AuthButton';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* This line sets the favicon */}
        <link rel="icon" href="/logo.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 min-h-screen dark:bg-gray-900 dark:text-gray-100">
        <Providers>
          <header className="p-4 shadow bg-white dark:bg-gray-800 dark:shadow-lg rounded-b-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Miles Logo"
                  width={40}
                  height={40}
                  className="rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>
              <AuthButton />
            </div>
          </header>
          <main className="p-4 max-w-3xl mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}