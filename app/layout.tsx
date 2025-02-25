import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import AppProvider from "@/components/providers/AppProvider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoScraper",
  description: "Automate your web scraping process with AI powered scrapper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignOutUrl={'/sign-in'}
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm !shadow-none",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <NextTopLoader color="#10b981" showSpinner={false} />
          <AppProvider>
            {children}
          </AppProvider>
        </body>
        <Toaster richColors/>
      </html>
    </ClerkProvider>
  );
}
