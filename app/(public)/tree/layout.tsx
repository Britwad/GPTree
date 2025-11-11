"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { type PaginatedTreesResponse } from "@/lib/validation_schemas";


// Fetcher function for SWR
const fetcher = async (url: string): Promise<PaginatedTreesResponse> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch trees');
    }
    return response.json();
};

export default function TreeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Create SWR key based on userId
    const swrKey = session?.user?.id 
        ? `/api/trees?userId=${session.user.id}&limit=10&offset=0`
        : null;

    // Use SWR for data fetching
    const { data, error, isLoading } = useSWR(
        status === "loading" ? null : swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    const trees = data?.trees ?? [];
    const loading = isLoading || status === "loading";

    console.log("TREES:", trees);

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Left Panel */}
            <aside
                className={`${isCollapsed ? "w-16" : "w-64"
                    } bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col`}
            >
                {/* Toggle Button */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    {!isCollapsed && <h2 className="font-semibold text-gray-900">Trees</h2>}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 hover:bg-gray-200 rounded"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Panel Content */}
                {!isCollapsed && (
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            <Link
                                href="/tree"
                                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === "/tree"
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Create New Tree
                            </Link>

                            <div className="pt-4">
                                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Recent Trees
                                </h3>
                                <div className="space-y-1">
                                    {loading ? (
                                        <div className="px-3 py-2 text-sm text-gray-500 italic">
                                            Loading trees...
                                        </div>
                                    ) : trees.length === 0 ? (
                                        <div className="px-3 py-2 text-sm text-gray-500 italic">
                                            No recent trees yet
                                        </div>
                                    ) : (
                                        trees.map((tree) => (
                                            <Link
                                                key={tree.id}
                                                href={`/tree/${tree.hash}`}
                                                className={`block px-3 py-2 rounded-md text-sm transition-colors ${pathname === `/tree/${tree.hash}`
                                                        ? "bg-blue-50 text-blue-900"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div className="font-medium truncate">{tree.name}</div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                )}

                {/* Collapsed State Icons */}
                {isCollapsed && (
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="space-y-2">
                            <Link
                                href="/tree"
                                className={`block p-3 rounded-md transition-colors ${pathname === "/tree"
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                title="Create New Tree"
                            >
                                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden bg-white">
                {children}
            </main>
        </div>
    );
}
