import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { logger } from '@/lib/observability/logger';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'CUSTOMER' | 'STAFF' | 'COUNSELOR' | 'ADMIN';
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.hashedPassword) return null;

        const valid = await compare(parsed.data.password, user.hashedPassword);
        if (!valid) {
          logger.warn({ email: parsed.data.email }, 'failed_login_attempt');
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'CUSTOMER';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'CUSTOMER' | 'STAFF' | 'COUNSELOR' | 'ADMIN';
      }
      return session;
    },
  },
});
