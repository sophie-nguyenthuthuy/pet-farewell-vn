import 'server-only';
import type { Prisma } from '@prisma/client';
import { BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { ConflictError, NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/observability/logger';

const ALLOWED: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PENDING_PAYMENT', 'CANCELLED'],
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
};

export function isValidTransition(from: BookingStatus, to: BookingStatus): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}

function timestampField(s: BookingStatus): 'confirmedAt' | 'completedAt' | null {
  if (s === BookingStatus.CONFIRMED) return 'confirmedAt';
  if (s === BookingStatus.COMPLETED) return 'completedAt';
  return null;
}

export async function transitionStatus(
  bookingId: string,
  next: BookingStatus,
  actorId?: string,
  notes?: string,
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new NotFoundError('Booking');

  if (booking.status === next) return booking;

  if (!isValidTransition(booking.status, next)) {
    throw new ConflictError(`Invalid transition: ${booking.status} → ${next}`);
  }

  const ts = timestampField(next);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: next, ...(ts ? { [ts]: new Date() } : {}) },
    });
    await tx.bookingEvent.create({
      data: {
        bookingId,
        type: 'status_changed',
        payload: { from: booking.status, to: next, notes } as Prisma.InputJsonValue,
        actorId,
      },
    });
    logger.info({ bookingId, from: booking.status, to: next, actorId }, 'booking_status_changed');
    return updated;
  });
}

export async function listForOps(filter: {
  status?: BookingStatus;
  search?: string;
  take?: number;
}) {
  const where: Prisma.BookingWhereInput = {};
  if (filter.status) where.status = filter.status;
  if (filter.search) {
    where.OR = [
      { code: { contains: filter.search, mode: 'insensitive' } },
      { customer: { name: { contains: filter.search, mode: 'insensitive' } } },
      { customer: { email: { contains: filter.search, mode: 'insensitive' } } },
    ];
  }
  return prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: filter.take ?? 50,
    include: { customer: true, pet: true },
  });
}
