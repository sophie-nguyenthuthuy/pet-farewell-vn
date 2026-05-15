import type { Metadata } from 'next';
import { listServicesByCategory } from '@/server/services/catalog';
import { formatVnd } from '@/lib/utils';

export const metadata: Metadata = { title: 'Bảng giá' };
export const revalidate = 600;

export default async function PricingPage() {
  const services = await listServicesByCategory();

  return (
    <div className="container max-w-4xl py-16">
      <h1 className="font-serif text-4xl">Bảng giá minh bạch</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Giá theo cân nặng / kích thước của bé. Không phụ phí ẩn — tro cốt, hũ, chứng nhận đều đã
        bao gồm với gói hỏa táng riêng.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-4">Dịch vụ</th>
              <th className="p-4 text-center">XS</th>
              <th className="p-4 text-center">S</th>
              <th className="p-4 text-center">M</th>
              <th className="p-4 text-center">L</th>
              <th className="p-4 text-center">XL</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const byBand = new Map(s.tiers.map((t) => [t.sizeBand, t.priceVnd]));
              return (
                <tr key={s.id} className="border-t">
                  <td className="p-4 font-medium">{s.nameVi}</td>
                  {(['XS', 'S', 'M', 'L', 'XL'] as const).map((b) => (
                    <td key={b} className="p-4 text-center text-muted-foreground">
                      {byBand.get(b) ? formatVnd(byBand.get(b)!) : '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
