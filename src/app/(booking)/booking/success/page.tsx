import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBookingByCode } from '@/server/services/bookings';
import { formatDateTime, formatVnd } from '@/lib/utils';

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (!code) notFound();
  const booking = await getBookingByCode(code);
  if (!booking) notFound();

  return (
    <div className="container max-w-2xl">
      <Card>
        <CardContent className="space-y-6 p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
          <div>
            <h1 className="font-serif text-3xl">Đã nhận yêu cầu của bạn</h1>
            <p className="mt-2 text-muted-foreground">
              Mã đơn: <span className="font-medium">{booking.code}</span>
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border p-4 text-left text-sm">
            <Row label="Bé yêu" value={booking.pet?.name ?? '—'} />
            <Row label="Dịch vụ" value={booking.items[0]?.service.nameVi ?? '—'} />
            <Row
              label="Thời gian dự kiến"
              value={booking.scheduledFor ? formatDateTime(booking.scheduledFor) : '—'}
            />
            <Row label="Tổng phí" value={formatVnd(booking.totalVnd)} bold />
          </div>

          <p className="text-sm text-muted-foreground">
            Đội điều phối sẽ liên hệ qua số điện thoại đã đăng ký trong vòng 30 phút. Nếu cần
            gấp, vui lòng gọi hotline <strong>1900 0099</strong>.
          </p>

          <div className="flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Về trang chủ</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/bookings">Xem trong tài khoản</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );
}
