import 'server-only';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session.user;
}

export async function requireRole(roles: Array<'STAFF' | 'COUNSELOR' | 'ADMIN'>) {
  const user = await requireUser();
  if (!roles.includes(user.role as 'STAFF' | 'COUNSELOR' | 'ADMIN')) {
    redirect('/');
  }
  return user;
}
