"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { Tree, BookOpen } from 'phosphor-react';
import { type PaginatedTreesResponse } from "@/lib/validation_schemas";
import { colors } from "@/lib/colors";

// Fetcher function for SWR
const fetcher = async (url: string): Promise<PaginatedTreesResponse> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch trees');
    }
    return response.json();
};

export default function GlobalSidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();

    // Create SWR key based on userId
    const swrKey = session?.user?.id 
        ? `/api/trees?userId=${session.user.id}&limit=10&offset=0`
        : null;

    // Use SWR for data fetching
    const { data, isLoading } = useSWR(
        status === "loading" ? null : swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    useEffect(() => {
        if (!session && status !== "loading") {
          router.push("/");
        }
      }, [session, status, router]);

    const trees = data?.trees ?? [];
    const loading = isLoading || status === "loading";

    if (!session) {
        return null;
    }

    return (
        <aside
            className="w-64 flex flex-col h-screen fixed left-0 top-0"
            style={{ backgroundColor: colors.lightGreen, borderRightColor: colors.borderGreen, borderRightWidth: '2px' }}
        >
            {/* Top Section - Logo */}
            <div className="p-4 flex gap-2">
                <Link href="/tree" className="flex items-center gap-2 flex-1 min-w-0">
                    <Image 
                        src="/icon/apple-touch-icon.png" 
                        alt="GPTree Logo" 
                        width={32} 
                        height={32}
                        className="flex-shrink-0"
                    />
                    <h1 className="font-semibold truncate text-xl" style={{ color: colors.darkGray }}>GPTree</h1>
                </Link>
            </div>

            {/* Middle Section - Navigation and Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    {/* Create New Tree Button */}
                    <Link
                        href="/tree"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        style={{
                            backgroundColor: pathname === "/tree" ? colors.superLightGreen : 'transparent',
                            color: pathname === "/tree" ? colors.green : colors.darkGray
                        }}
                        onMouseEnter={(e) => pathname !== "/tree" && (e.currentTarget.style.backgroundColor = colors.lightGreenHover)}
                        onMouseLeave={(e) => pathname !== "/tree" && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <Tree size={18} weight="fill" />
                        Create New Tree
                    </Link>

                    {/* Study Button */}
                    <Link
                        href="/study"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        style={{
                            backgroundColor: pathname === "/study" ? colors.superLightGreen : 'transparent',
                            color: pathname === "/study" ? colors.green : colors.darkGray
                        }}
                        onMouseEnter={(e) => pathname !== "/study" && (e.currentTarget.style.backgroundColor = colors.lightGreenHover)}
                        onMouseLeave={(e) => pathname !== "/study" && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <BookOpen size={18} weight="fill" />
                        Study
                    </Link>

                    <div className="pt-4">
                        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider mb-2" style={{color: colors.darkGray}}>
                            Recent Trees
                        </h3>
                        <div className="space-y-1">
                            {loading ? (
                                <div className="px-3 py-2 text-sm italic" style={{ color: colors.darkGray }}>
                                    Loading trees...
                                </div>
                            ) : trees.length === 0 ? (
                                <div className="px-3 py-2 text-sm italic" style={{ color: colors.darkGray }}>
                                    No recent trees yet
                                </div>
                            ) : (
                                trees.map((tree) => (
                                    <Link
                                        key={tree.id}
                                        href={`/tree/${tree.hash}`}
                                        className="block px-3 py-2 rounded-md text-sm transition-colors"
                                        style={{
                                            backgroundColor: pathname === `/tree/${tree.hash}` ? colors.superLightGreen : 'transparent',
                                            color: pathname === `/tree/${tree.hash}` ? colors.green : colors.darkGray
                                        }}
                                        onMouseEnter={(e) => pathname !== `/tree/${tree.hash}` && (e.currentTarget.style.backgroundColor = colors.lightGray)}
                                        onMouseLeave={(e) => pathname !== `/tree/${tree.hash}` && (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        <div className="font-medium truncate">{tree.name}</div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - User Info */}
            <div className="p-4">
                <div className="space-y-3">
                    <div className="text-xs" style={{ color: colors.darkGray }}>
                        <div className="font-semibold truncate">{session?.user?.name || 'User'}</div>
                        <div className="text-xs truncate" style={{ color: colors.darkGray }}>
                            {session?.user?.email}
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full text-white px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                        style={{ backgroundColor: colors.green }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.darkGreen}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.green}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
