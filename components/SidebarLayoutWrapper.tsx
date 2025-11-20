"use client";

import { useSession } from "next-auth/react";

export default function SidebarLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const showSidebar = session && status === "authenticated";

  return (
    <div style={{ marginLeft: showSidebar ? '16rem' : '0', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
