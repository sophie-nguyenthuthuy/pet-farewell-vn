import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { requireUser } from '@/lib/auth/guard';
import { listCustomerBookings } from '@/server/services/bookings';

export default async function DashboardPage() {
  const user = await requireUser();
  const bookings = await listCustomerBookings(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Xin chào, {user.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Quản lý đơn tiễn biệt, hồ sơ thú cưng và bài tưởng niệm tại đây.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <NavCard href="/dashboard/bookings" title="Đơn đặt lịch" hint={`${bookings.length} đơn`} />
        <NavCard href="/dashboard/memorials" title="Bài tưởng niệm" hint="Tạo & quản lý" />
        <NavCard href="/dashboard/profile" title="Hồ sơ" hint="Thông tin liên hệ" />
      </div>

      <div className="rounded-2xl border p-6">
        <p className="font-serif text-xl">Đơn gần đây</p>
        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Bạn chưa có đơn nào. <Link href="/booking/step-pet" className="text-primary underline">Đặt lịch mới</Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y">
            {bookings.slice(0, 5).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{b.pet?.name ?? 'Đơn'} · {b.code}</p>
                  <p className="text-xs text-muted-foreground">{b.status}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/bookings/${b.code}`}>Chi tiết</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function NavCard({ href, title, hint }: { href: string; title: string; hint: string }) {
  return (
    <Link href={href}>
      <Card className="transition hover:shadow-md">
        <CardContent className="p-6">
          <p className="font-serif text-xl">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
