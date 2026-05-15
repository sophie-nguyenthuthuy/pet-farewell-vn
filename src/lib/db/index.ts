import 'server-only';
import { PrismaClient } from '@prisma/client';
import { env, isProd } from '@/lib/env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isProd ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
  });

if (!isProd) globalForPrisma.prisma = prisma;

export type { Prisma } from '@prisma/client';
export * from '@prisma/client';
export { env as dbEnv };
