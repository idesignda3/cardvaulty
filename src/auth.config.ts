import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma / Node-only imports).
 * Used by proxy for optimistic route gates.
 */
export const authConfig = {
  pages: {
    signIn: "/auth",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/vault") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/account");
      if (isProtected) return !!auth?.user;
      return true;
    },
  },
} satisfies NextAuthConfig;
