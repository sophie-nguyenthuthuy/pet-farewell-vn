import { requireRole } from '@/lib/auth/guard';
import { listForOps } from '@/server/services/booking-status';
import { formatVnd, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Bảng điều hành' };
export const dynamic = 'force-dynamic';

type Search = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function AdminPage({ searchParams }: Search) {
  await requireRole(['STAFF', 'ADMIN']);
  const { q, status } = await searchParams;

  const bookings = await listForOps({
    search: q,
    // Cast: we trust the route guard but Prisma still wants a typed enum.
    status: status as Parameters<typeof listForOps>[0]['status'],
  });

  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl">Bảng điều hành</h1>

      <form className="mt-6 flex flex-wrap gap-2" method="get">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Tìm theo mã, email, tên khách…"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ''}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option>PENDING_PAYMENT</option>
          <option>CONFIRMED</option>
          <option>IN_PROGRESS</option>
          <option>COMPLETED</option>
          <option>CANCELLED</option>
        </select>
        <button className="h-10 rounded-md border bg-primary px-4 text-sm text-primary-foreground">
          Lọc
        </button>
      </form>

      <table className="mt-6 w-full overflow-hidden rounded-lg border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left font-medium">Mã</th>
            <th className="p-3 text-left font-medium">Khách</th>
            <th className="p-3 text-left font-medium">Bé</th>
            <th className="p-3 text-left font-medium">Trạng thái</th>
            <th className="p-3 text-right font-medium">Tổng</th>
            <th className="p-3 text-right font-medium">Lịch</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-3 font-mono text-xs">{b.code}</td>
              <td className="p-3">
                <p>{b.customer.name}</p>
                <p className="text-xs text-muted-foreground">{b.customer.email}</p>
              </td>
              <td className="p-3">{b.pet?.name ?? '—'}</td>
              <td className="p-3">
                <Badge variant="secondary">{b.status}</Badge>
              </td>
              <td className="p-3 text-right">{formatVnd(b.totalVnd)}</td>
              <td className="p-3 text-right text-xs">
                {b.scheduledFor ? formatDateTime(b.scheduledFor) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
