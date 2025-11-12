import { Geist, Geist_Mono } from "next/font/google";
// import { SessionProvider } from "next-auth/react"
import type { Metadata } from "next";

import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPTree",
  description: "Learn anything, one branch at a time.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <Header />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
