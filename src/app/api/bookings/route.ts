import { NextResponse, type NextRequest } from 'next/server';
import { CreateBookingSchema } from '@/lib/validation';
import { createBooking } from '@/server/services/bookings';
import { logger } from '@/lib/observability/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = CreateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const booking = await createBooking(parsed.data);
    return NextResponse.json(
      {
        data: {
          code: booking.code,
          totalVnd: booking.totalVnd,
          status: booking.status,
          scheduledFor: booking.scheduledFor,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    logger.error({ err }, 'api_create_booking_failed');
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
