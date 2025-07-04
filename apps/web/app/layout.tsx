import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900 min-h-screen dark:bg-gray-900 dark:text-gray-100">
        <header className="p-4 shadow bg-white dark:bg-gray-800 dark:shadow-lg rounded-b-xl">
          <h1 className="text-2xl font-bold">Miles ✈️</h1>
        </header>
        <main className="p-4 max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
} 