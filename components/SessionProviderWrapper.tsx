"use client"

import { SessionProvider } from "next-auth/react"

export function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refresh session every 5 minutes
      refetchOnWindowFocus={true} // Refresh when window regains focus
    >
      {children}
    </SessionProvider>
  )
}
