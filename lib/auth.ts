import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@nexgen-affilates.com";
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "NexGen2026!";

const providers = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
      const password = typeof credentials?.password === "string" ? credentials.password : "";

      if (email === defaultAdminEmail && password === defaultAdminPassword) {
        return {
          id: "default-admin",
          name: "Default Admin",
          email: defaultAdminEmail,
          image: null,
        };
      }

      return null;
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "change-me-in-production",
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});