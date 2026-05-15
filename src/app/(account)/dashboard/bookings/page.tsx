import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireUser } from '@/lib/auth/guard';
import { listCustomerBookings } from '@/server/services/bookings';
import { formatDateTime, formatVnd } from '@/lib/utils';

export default async function MyBookingsPage() {
  const user = await requireUser();
  const bookings = await listCustomerBookings(user.id);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Đơn đặt lịch</h1>

      {bookings.length === 0 && (
        <p className="text-muted-foreground">Bạn chưa có đơn nào.</p>
      )}

      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-xl">{b.pet?.name ?? 'Đơn'}</p>
                  <Badge variant="outline">{b.code}</Badge>
                  <Badge variant="secondary">{b.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {b.items[0]?.service.nameVi}
                  {b.scheduledFor && ` · ${formatDateTime(b.scheduledFor)}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-xl">{formatVnd(b.totalVnd)}</p>
                <Link
                  href={`/dashboard/bookings/${b.code}`}
                  className="text-sm text-primary underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
