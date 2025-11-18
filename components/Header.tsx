"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { colors } from "@/lib/colors";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/");
    }
  }, [session, status, router]);

  if (!session) {
    return null;
  }

  return (
    <header className="shadow-sm" style={{ backgroundColor: colors.white, fontFamily: colors.font, borderBottomColor: colors.borderGreen, borderBottomWidth: '2px' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold px-3 py-2 rounded-md" style={{ fontFamily: colors.font, color: colors.darkGray }} onMouseEnter={(e) => e.currentTarget.style.color = colors.darkGreen} onMouseLeave={(e) => e.currentTarget.style.color = colors.darkGray}>
              GPTree
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/tree"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ fontFamily: colors.font, color: colors.darkGray }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.superLightGreen}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Trees
            </Link>
            <Link
              href="/study"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ fontFamily: colors.font, color: colors.darkGray }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.superLightGreen}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Study
            </Link>

            <div className="flex items-center space-x-3">
              <span className="text-sm" style={{ fontFamily: colors.font, color: colors.darkGray }}>
                {session.user?.email || session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ fontFamily: colors.font, backgroundColor: colors.green }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.darkGreen}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.green}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
