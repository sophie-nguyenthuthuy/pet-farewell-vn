import 'server-only';
import { type Prisma, PaymentProvider, PaymentStatus, BookingStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { ConflictError, NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/observability/logger';
import { transitionStatus } from './booking-status';

export interface RecordPaymentInput {
  bookingCode: string;
  provider: PaymentProvider;
  providerRef: string;
  amountVnd: number;
  raw: Prisma.InputJsonValue;
  succeeded: boolean;
}

/**
 * Idempotent payment recorder. Safe to call multiple times for the same
 * providerRef — duplicate webhooks no-op. We verify amount matches the
 * booking total to defend against tampered callbacks.
 */
export async function recordPayment(input: RecordPaymentInput): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { code: input.bookingCode } });
  if (!booking) throw new NotFoundError('Booking');

  const existing = await prisma.payment.findUnique({ where: { providerRef: input.providerRef } });
  if (existing) {
    logger.info(
      { providerRef: input.providerRef, bookingCode: input.bookingCode },
      'payment_webhook_duplicate',
    );
    return;
  }

  if (input.amountVnd !== booking.totalVnd) {
    throw new ConflictError(
      `Payment amount ${input.amountVnd} does not match booking total ${booking.totalVnd}`,
    );
  }

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: input.provider,
      providerRef: input.providerRef,
      amountVnd: input.amountVnd,
      raw: input.raw,
      status: input.succeeded ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED,
      capturedAt: input.succeeded ? new Date() : null,
    },
  });

  if (input.succeeded && booking.status === BookingStatus.PENDING_PAYMENT) {
    await transitionStatus(booking.id, BookingStatus.CONFIRMED);
  }
}
