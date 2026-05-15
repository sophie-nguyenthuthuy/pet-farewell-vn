import { NextResponse, type NextRequest } from 'next/server';
import { verifyVnpaySignature } from '@/lib/payments/vnpay';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/observability/logger';
import { BookingStatus, PaymentProvider, PaymentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const { valid, data } = verifyVnpaySignature(params);
  if (!valid) {
    logger.warn({ data }, 'vnpay_signature_invalid');
    return NextResponse.json({ rspCode: '97', message: 'invalid_signature' }, { status: 400 });
  }

  const bookingCode = data.vnp_TxnRef;
  const responseCode = data.vnp_ResponseCode;
  const amount = Number(data.vnp_Amount ?? 0) / 100;

  if (!bookingCode) {
    return NextResponse.json({ rspCode: '01', message: 'missing_ref' }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { code: bookingCode } });
  if (!booking) {
    return NextResponse.json({ rspCode: '01', message: 'booking_not_found' }, { status: 404 });
  }

  const succeeded = responseCode === '00';
  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        provider: PaymentProvider.VNPAY,
        status: succeeded ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED,
        amountVnd: amount,
        providerRef: data.vnp_TransactionNo ?? null,
        capturedAt: succeeded ? new Date() : null,
        raw: data as unknown as object,
      },
    });
    if (succeeded) {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CONFIRMED, confirmedAt: new Date() },
      });
    }
    await tx.bookingEvent.create({
      data: {
        bookingId: booking.id,
        type: succeeded ? 'payment_succeeded' : 'payment_failed',
        payload: { provider: 'vnpay', responseCode },
      },
    });
  });

  return NextResponse.json({ rspCode: '00', message: 'confirm_success' });
}
