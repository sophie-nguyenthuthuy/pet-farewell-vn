import 'server-only';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email/client';
import { bookingConfirmationEmail } from '@/lib/email/templates';
import { sendSms } from '@/lib/notifications/sms';
import { logger } from '@/lib/observability/logger';
import { NotFoundError } from '@/lib/errors';

export async function notifyBookingConfirmed(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      pet: true,
      items: { include: { service: true }, take: 1 },
    },
  });

  if (!booking) throw new NotFoundError('Booking');
  if (!booking.scheduledFor || !booking.pet || booking.items.length === 0) {
    logger.warn({ bookingId }, 'notify_booking_confirmed_missing_fields');
    return;
  }

  const tpl = bookingConfirmationEmail({
    customerName: booking.customer.name,
    bookingCode: booking.code,
    petName: booking.pet.name,
    serviceName: booking.items[0]!.service.nameVi,
    scheduledFor: booking.scheduledFor,
    totalVnd: booking.totalVnd,
  });

  await Promise.allSettled([
    sendEmail({ to: booking.customer.email, subject: tpl.subject, html: tpl.html, text: tpl.text }),
    booking.customer.phone
      ? sendSms({
          to: booking.customer.phone,
          body: `Pet Farewell: Đặt lịch ${booking.code} đã được xác nhận. Đội ngũ sẽ liên hệ trong 30 phút.`,
        })
      : Promise.resolve(),
  ]);
}
