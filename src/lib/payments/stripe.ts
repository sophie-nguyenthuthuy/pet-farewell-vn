import 'server-only';
import Stripe from 'stripe';
import { env } from '@/lib/env';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!_stripe) {
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
      appInfo: { name: 'pet-farewell-vn', version: '0.1.0' },
    });
  }
  return _stripe;
}

export async function createCheckoutSession(input: {
  bookingId: string;
  bookingCode: string;
  amountVnd: number;
  customerEmail: string;
  description: string;
}): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: input.customerEmail,
    client_reference_id: input.bookingId,
    metadata: { bookingId: input.bookingId, bookingCode: input.bookingCode },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'vnd',
          unit_amount: input.amountVnd,
          product_data: { name: input.description },
        },
      },
    ],
    success_url: `${baseUrl}/booking/success?code=${input.bookingCode}`,
    cancel_url: `${baseUrl}/booking/step-confirm?code=${input.bookingCode}`,
  });

  if (!session.url) throw new Error('Stripe did not return a checkout URL');
  return { url: session.url, sessionId: session.id };
}
