import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Email from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      server: process.env.EMAIL_SERVER!, // e.g., SMTP connection string
      from: process.env.EMAIL_FROM!,     // sender email
    }),
  ],
  session: { strategy: "jwt" },
//   pages: {
//     signIn: "/auth/signin", // optional custom sign-in page
//   },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub
      return session
    },
  },
})

export { handler as GET, handler as POST }
