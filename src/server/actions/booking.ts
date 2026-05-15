'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { CreateBookingSchema } from '@/lib/validation';
import { createBooking } from '@/server/services/bookings';
import { logger } from '@/lib/observability/logger';

export type BookingActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> }
  | { status: 'success'; bookingCode: string };

export async function submitBookingAction(
  _prev: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const raw = Object.fromEntries(formData.entries());

  // The form serializes complex objects as JSON strings.
  let payload: unknown;
  try {
    payload = JSON.parse(String(raw.payload ?? '{}'));
  } catch {
    return { status: 'error', message: 'Dữ liệu không hợp lệ' };
  }

  const parsed = CreateBookingSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Vui lòng kiểm tra lại thông tin',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const booking = await createBooking(parsed.data);
    revalidatePath('/dashboard/bookings');
    redirect(`/booking/success?code=${booking.code}`);
  } catch (err) {
    logger.error({ err }, 'submit_booking_failed');
    return { status: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline 1900 0099.' };
  }
}
