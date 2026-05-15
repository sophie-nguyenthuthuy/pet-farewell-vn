import 'server-only';
import { prisma } from '@/lib/db';
import { NotFoundError } from '@/lib/errors';

export async function getMemorialBySlug(slug: string) {
  const memorial = await prisma.memorial.findUnique({
    where: { slug },
    include: {
      pet: true,
      author: { select: { id: true, name: true } },
      tributes: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!memorial) throw new NotFoundError('Memorial');
  return memorial;
}

export async function listPublicMemorials(take = 24) {
  return prisma.memorial.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      pet: true,
      _count: { select: { tributes: true } },
    },
  });
}
