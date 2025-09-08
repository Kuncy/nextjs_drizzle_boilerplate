import NextAuth from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";
import * as schema from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/login",
  },
  providers: [
    github({ allowDangerousEmailAccountLinking: true }),
    google({ allowDangerousEmailAccountLinking: true }),
    CredentialsProvider({
      name: "Sign in",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Fetch first user matching the email
        const users = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, credentials.email))
          .limit(1)
          .execute(); // returns an array

        const user = users[0]; // get the first (and only) user

        if (!user) return null;

        // Verify password
        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!isValid) return null;

        // Return the user object for NextAuth
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: "Hey cool",
        };
      },
    }),
  ],
  callbacks: {
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!auth?.user;
    const paths = ["/", "/client-side", "/api/session"];
    const isProtected = paths.some((path) =>
      nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !isLoggedIn) {
      const redirectUrl = new URL("/login", nextUrl.origin);
      redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
      return Response.redirect(redirectUrl);
    }
    return true;
  },

  async jwt({ token, user }) {
    if (user) {
      const u = user as any;

      token.id = u.id;
      token.name = u.name;
      token.email = u.email;
    }
    return token;
  },

  async session({ session, token }) {
    return {
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
      },
    };
  }
}
});
