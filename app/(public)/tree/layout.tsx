"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { type PaginatedTreesResponse } from "@/lib/validation_schemas";


// Fetcher function for SWR
const fetcher = async (url: string): Promise<PaginatedTreesResponse> => {
    const response = await fetch(url, {
        credentials: 'include' // Send cookies with the request
    });
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
    return (
        <div style={{ backgroundColor: colors.lightGreen, minHeight: '100vh', overflow: 'hidden' }}>
            {children}
        </div>
    );
}
