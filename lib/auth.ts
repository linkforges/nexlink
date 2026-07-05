import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@nexgen-affilates.com";
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "NexGen2026!";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password.trim() : "";

        if (email === defaultAdminEmail && password === defaultAdminPassword) {
          return {
            id: "default-admin",
            name: "Default Admin",
            email: defaultAdminEmail,
            image: null,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "change-me-in-production",
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = (token.name as string) ?? "Admin";
        (session.user as { role?: string }).role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
});