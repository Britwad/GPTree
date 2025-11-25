import { Geist, Geist_Mono, Inter } from "next/font/google";
// import { SessionProvider } from "next-auth/react"
import type { Metadata } from "next";

import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import GlobalSidebar from "@/components/GlobalSidebar";
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper";
import { colors } from "@/lib/colors";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GPTree",
  description: "Learn anything, one branch at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: colors.font }}
      >
        <SessionProviderWrapper>
          <GlobalSidebar />
          <SidebarLayoutWrapper>
            {children}
          </SidebarLayoutWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
