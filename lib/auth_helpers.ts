import { getServerSession, type NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Export the auth config so it can be reused
export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.sub) session.user.id = token.sub;
      return session;
    },
  },
};

/**
 * Get the current user's session and verify they are authenticated.
 * Returns the session if valid, or null if not.
 */
export async function getAuthenticatedSession() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.id) {
    return null;
  }
  
  return session;
}

/**
 * Verify that the request is from an authenticated user and that the userId
 * matches the session. Returns { authorized: true } or { authorized: false, response: NextResponse }
 */
export async function verifyUserAuthorization(requestedUserId: string | undefined) {
  if (!requestedUserId) {
    return { authorized: false, response: NextResponse.json({ error: "userId is required" }, { status: 400 }) };
  }

  const session = await getAuthenticatedSession();
  
  if (!session?.user?.id) {
    return { authorized: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (session.user.id !== requestedUserId) {
    return { authorized: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { authorized: true, response: null };
}
