import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? "admin@nexgen-affilates.com";
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? "NexGen2026!";

async function ensureDefaultAdminUser() {
  const existing = await prisma.user.findUnique({ where: { email: defaultAdminEmail } });
  if (existing) {
    if (!existing.password) {
      const hashed = await bcrypt.hash(defaultAdminPassword, 12);
      await prisma.user.update({ where: { id: existing.id }, data: { password: hashed } });
    }
    return existing;
  }

  const hashed = await bcrypt.hash(defaultAdminPassword, 12);
  return prisma.user.create({
    data: {
      email: defaultAdminEmail,
      name: "Default Admin",
      password: hashed,
    },
  });
}

const providers: Provider[] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
      const password = typeof credentials?.password === "string" ? credentials.password : "";
      if (!email || !password) return null;

      if (email === defaultAdminEmail && password === defaultAdminPassword) {
        const user = await ensureDefaultAdminUser();
        return {
          id: user.id,
          name: user.name ?? user.email.split("@")[0],
          email: user.email,
          image: user.image,
        };
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) return null;

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return null;

      return {
        id: user.id,
        name: user.name ?? user.email.split("@")[0],
        email: user.email,
        image: user.image,
      };
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});