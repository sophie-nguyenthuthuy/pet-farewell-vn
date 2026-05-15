import Link from 'next/link';
import { requireRole } from '@/lib/auth/guard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['ADMIN', 'STAFF']);

  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r bg-muted/30 p-6">
        <p className="font-serif text-xl">Pet Farewell</p>
        <p className="text-xs text-muted-foreground">Admin console</p>
        <nav className="mt-8 space-y-1 text-sm">
          {[
            { href: '/admin/bookings', label: 'Bookings' },
            { href: '/admin/services', label: 'Services' },
            { href: '/admin/customers', label: 'Customers' },
            { href: '/admin/payments', label: 'Payments' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-8">{children}</main>
    </div>
  );
}
