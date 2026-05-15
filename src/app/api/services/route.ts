import { NextResponse } from 'next/server';
import { listServicesByCategory } from '@/server/services/catalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const services = await listServicesByCategory();
  return NextResponse.json({
    data: services.map((s) => ({
      id: s.id,
      slug: s.slug,
      category: s.category,
      name: { vi: s.nameVi, en: s.nameEn },
      basePriceVnd: s.basePriceVnd,
      durationMin: s.durationMin,
      isFeatured: s.isFeatured,
      tiers: s.tiers.map((t) => ({ sizeBand: t.sizeBand, priceVnd: t.priceVnd })),
    })),
  });
}
