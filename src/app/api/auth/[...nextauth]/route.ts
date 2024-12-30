import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { Session } from 'next-auth';
import { User } from 'next-auth';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"


if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error("Missing GITHUB_ID or GITHUB_SECRET environment variable");
  }
  
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

