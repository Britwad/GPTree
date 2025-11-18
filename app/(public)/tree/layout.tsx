"use client";

import React from "react";
import { colors } from "@/lib/colors";

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
