import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, formatVnd } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { customer: true, pet: true, items: { include: { service: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Bookings</h1>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Pet</th>
              <th className="p-3">Service</th>
              <th className="p-3">Scheduled</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3 font-mono">
                  <Link href={`/admin/bookings/${b.code}`} className="underline">{b.code}</Link>
                </td>
                <td className="p-3">{b.customer.name}</td>
                <td className="p-3">{b.pet?.name ?? '—'}</td>
                <td className="p-3">{b.items[0]?.service.nameVi ?? '—'}</td>
                <td className="p-3">{b.scheduledFor ? formatDateTime(b.scheduledFor) : '—'}</td>
                <td className="p-3 text-right">{formatVnd(b.totalVnd)}</td>
                <td className="p-3"><Badge variant="outline">{b.status}</Badge></td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
