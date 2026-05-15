import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  const staticRoutes = [
    '',
    '/services',
    '/pricing',
    '/memorial',
    '/grief-support',
    '/about',
    '/contact',
  ];

  // DB may not be reachable at build time. Be defensive — sitemap still emits static routes.
  let memorials: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    memorials = await prisma.memorial.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
      take: 1000,
    });
  } catch {
    memorials = [];
  }

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: r === '' ? 1 : 0.7,
    })),
    ...memorials.map((m) => ({
      url: `${base}/memorial/${m.slug}`,
      lastModified: m.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
