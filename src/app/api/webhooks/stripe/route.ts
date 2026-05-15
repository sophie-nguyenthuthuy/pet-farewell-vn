import { NextResponse, type NextRequest } from 'next/server';
import { getStripe } from '@/lib/payments/stripe';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { logger } from '@/lib/observability/logger';
import { BookingStatus, PaymentProvider, PaymentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'missing_signature' }, { status: 400 });

  const raw = await req.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.warn({ err }, 'stripe_signature_invalid');
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.client_reference_id ?? session.metadata?.bookingId;
    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          bookingId,
          provider: PaymentProvider.STRIPE,
          status: PaymentStatus.SUCCEEDED,
          amountVnd: session.amount_total ?? 0,
          providerRef: session.id,
          capturedAt: new Date(),
          raw: session as unknown as object,
        },
      });
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED, confirmedAt: new Date() },
      });
      await tx.bookingEvent.create({
        data: {
          bookingId,
          type: 'payment_succeeded',
          payload: { provider: 'stripe', sessionId: session.id },
        },
      });
    });

    logger.info({ bookingId, sessionId: session.id }, 'stripe_payment_succeeded');
  }

  return NextResponse.json({ received: true });
}
