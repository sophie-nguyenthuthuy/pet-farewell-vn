import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getServiceBySlug } from '@/server/services/catalog';
import { formatVnd } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Không tìm thấy dịch vụ' };
  return { title: service.nameVi, description: service.shortVi };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <article className="container max-w-3xl py-12">
      <Badge variant="secondary" className="mb-4">
        {service.category}
      </Badge>
      <h1 className="font-serif text-3xl md:text-4xl">{service.nameVi}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{service.shortVi}</p>

      <div className="mt-8 prose prose-stone max-w-none">
        <p>{service.descriptionVi}</p>
      </div>

      {service.tiers.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl">Giá theo cân nặng</h2>
          <table className="mt-3 w-full overflow-hidden rounded-lg border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Cỡ</th>
                <th className="p-3 text-right font-medium">Giá</th>
              </tr>
            </thead>
            <tbody>
              {service.tiers
                .slice()
                .sort((a, b) => a.sizeBand.localeCompare(b.sizeBand))
                .map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-3">{t.sizeBand}</td>
                    <td className="p-3 text-right font-medium">{formatVnd(t.priceVnd)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      )}

      <div className="mt-10 flex gap-3">
        <Button asChild size="lg">
          <Link href="/booking/step-pet">Đặt lịch dịch vụ này</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="tel:19000099">Gọi tư vấn</a>
        </Button>
      </div>
    </article>
  );
}
