import 'server-only';
import { prisma } from '@/lib/db';
import type { ServiceCategory } from '@prisma/client';

export async function listFeaturedServices() {
  return prisma.service.findMany({
    where: { isActive: true, isFeatured: true },
    include: { tiers: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function listServicesByCategory(category?: ServiceCategory) {
  return prisma.service.findMany({
    where: { isActive: true, ...(category ? { category } : {}) },
    include: { tiers: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
    include: { tiers: true },
  });
}

export async function listFaqs() {
  return prisma.faqItem.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function listApprovedTestimonials(limit = 6) {
  return prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
