import 'server-only';
import { prisma } from '@/lib/db';
import type { PetSizeBand } from '@prisma/client';

export type PriceQuote = {
  subtotalVnd: number;
  discountVnd: number;
  taxVnd: number;
  totalVnd: number;
  items: Array<{ serviceId: string; nameVi: string; unitPriceVnd: number; quantity: number; totalVnd: number }>;
};

export async function quote(input: {
  serviceId: string;
  addOnIds?: string[];
  sizeBand: PetSizeBand;
}): Promise<PriceQuote> {
  const service = await prisma.service.findUniqueOrThrow({
    where: { id: input.serviceId },
    include: { tiers: true },
  });

  const tier = service.tiers.find((t) => t.sizeBand === input.sizeBand);
  const mainPrice = tier?.priceVnd ?? service.basePriceVnd;

  const addOnServices = input.addOnIds?.length
    ? await prisma.service.findMany({ where: { id: { in: input.addOnIds } } })
    : [];

  const items = [
    {
      serviceId: service.id,
      nameVi: service.nameVi,
      unitPriceVnd: mainPrice,
      quantity: 1,
      totalVnd: mainPrice,
    },
    ...addOnServices.map((s) => ({
      serviceId: s.id,
      nameVi: s.nameVi,
      unitPriceVnd: s.basePriceVnd,
      quantity: 1,
      totalVnd: s.basePriceVnd,
    })),
  ];

  const subtotal = items.reduce((sum, i) => sum + i.totalVnd, 0);
  // Bereavement services are VAT-exempt in our model.
  const tax = 0;
  const discount = 0;

  return {
    subtotalVnd: subtotal,
    discountVnd: discount,
    taxVnd: tax,
    totalVnd: subtotal - discount + tax,
    items,
  };
}
