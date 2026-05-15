/**
 * Bootstrap an admin user. Run with:
 *   pnpm tsx scripts/seed-admin.ts admin@example.com 'StrongPassword!'
 *
 * Idempotent: if the user exists, role is upgraded to ADMIN and the password
 * is reset.
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error('Usage: pnpm tsx scripts/seed-admin.ts <email> <password>');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('Password must be at least 12 characters');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: UserRole.ADMIN, hashedPassword },
    create: {
      email,
      name: email.split('@')[0] ?? 'Admin',
      role: UserRole.ADMIN,
      hashedPassword,
    },
  });

  console.warn(`✓ Admin ready: ${user.email} (${user.id})`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
