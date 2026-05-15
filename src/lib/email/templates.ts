import { formatDateTime, formatVnd } from '@/lib/utils';

type BookingEmailInput = {
  customerName: string;
  bookingCode: string;
  petName: string;
  serviceName: string;
  scheduledFor: Date;
  totalVnd: number;
};

export function bookingConfirmationEmail(input: BookingEmailInput): { subject: string; html: string; text: string } {
  const subject = `Xác nhận đặt lịch tiễn biệt ${input.petName} — ${input.bookingCode}`;
  const text = [
    `Kính gửi ${input.customerName},`,
    '',
    `Chúng tôi đã nhận yêu cầu tiễn biệt cho bé ${input.petName}.`,
    `Mã đơn: ${input.bookingCode}`,
    `Dịch vụ: ${input.serviceName}`,
    `Thời gian dự kiến: ${formatDateTime(input.scheduledFor)}`,
    `Tổng phí: ${formatVnd(input.totalVnd)}`,
    '',
    'Đội ngũ điều phối sẽ liên hệ trong vòng 30 phút.',
    '',
    'Trân trọng,',
    'Pet Farewell',
  ].join('\n');

  const html = `
<!doctype html>
<html><body style="font-family: ui-sans-serif, system-ui; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 32px 16px;">
  <h1 style="font-size: 20px; font-weight: 600;">Cảm ơn bạn đã tin tưởng Pet Farewell</h1>
  <p>Kính gửi ${input.customerName},</p>
  <p>Chúng tôi đã nhận yêu cầu tiễn biệt bé <strong>${input.petName}</strong> và sẽ liên hệ trong vòng 30 phút để xác nhận chi tiết.</p>
  <table style="border-collapse: collapse; width: 100%; margin: 24px 0;">
    <tr><td style="padding: 8px 0; color: #6b6b6b;">Mã đơn</td><td style="padding: 8px 0; text-align: right;"><strong>${input.bookingCode}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #6b6b6b;">Dịch vụ</td><td style="padding: 8px 0; text-align: right;">${input.serviceName}</td></tr>
    <tr><td style="padding: 8px 0; color: #6b6b6b;">Thời gian dự kiến</td><td style="padding: 8px 0; text-align: right;">${formatDateTime(input.scheduledFor)}</td></tr>
    <tr><td style="padding: 8px 0; color: #6b6b6b;">Tổng phí</td><td style="padding: 8px 0; text-align: right;"><strong>${formatVnd(input.totalVnd)}</strong></td></tr>
  </table>
  <p style="color: #6b6b6b; font-size: 13px;">Hotline 24/7: 1900 0099 · hello@pet-farewell.vn</p>
</body></html>`.trim();

  return { subject, html, text };
}
