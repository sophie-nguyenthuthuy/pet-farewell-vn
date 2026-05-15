'use server';

import { revalidatePath } from 'next/cache';
import { customAlphabet } from 'nanoid';
import { CreateMemorialSchema, CreateTributeSchema } from '@/lib/validation';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth/guard';
import { logger } from '@/lib/observability/logger';

const slugId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);

export async function createMemorialAction(formData: FormData) {
  const user = await requireUser();
  const parsed = CreateMemorialSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    throw new Error('Invalid memorial input');
  }

  const pet = await prisma.pet.findFirst({
    where: { id: parsed.data.petId, ownerId: user.id },
  });
  if (!pet) throw new Error('Pet not found');

  const memorial = await prisma.memorial.create({
    data: {
      ...parsed.data,
      authorId: user.id,
      slug: `${pet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${slugId()}`,
    },
  });

  logger.info({ memorialId: memorial.id }, 'memorial_created');
  revalidatePath('/memorial');
  revalidatePath('/dashboard/memorials');
  return memorial;
}

export async function addTributeAction(formData: FormData) {
  const parsed = CreateTributeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    throw new Error('Invalid tribute input');
  }

  const tribute = await prisma.tribute.create({ data: parsed.data });
  revalidatePath(`/memorial`);
  return tribute;
}
