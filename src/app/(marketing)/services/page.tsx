import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatVnd } from '@/lib/utils';
import { listServicesByCategory } from '@/server/services/catalog';

export const metadata: Metadata = {
  title: 'Dịch vụ',
  description: 'Hỏa táng riêng, hỏa táng chung, chôn cất tại vườn tưởng niệm và các dịch vụ bổ sung.',
};

export const revalidate = 600;

export default async function ServicesPage() {
  const services = await listServicesByCategory();

  return (
    <div className="container max-w-5xl py-16">
      <h1 className="font-serif text-4xl">Dịch vụ</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Chọn phương án phù hợp nhất với mong muốn của gia đình. Đội ngũ của chúng tôi sẵn sàng tư
        vấn miễn phí 24/7 qua hotline 1900 0099.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-serif">{s.nameVi}</CardTitle>
                {s.isFeatured && <Badge variant="success">Phổ biến</Badge>}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="text-sm text-muted-foreground">{s.descriptionVi}</p>

              {s.tiers.length > 0 && (
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    Bảng giá theo kích thước
                  </p>
                  <ul className="grid grid-cols-5 gap-2 text-center text-xs">
                    {s.tiers
                      .sort((a, b) => ['XS', 'S', 'M', 'L', 'XL'].indexOf(a.sizeBand) - ['XS', 'S', 'M', 'L', 'XL'].indexOf(b.sizeBand))
                      .map((t) => (
                        <li key={t.id} className="rounded bg-muted/50 p-2">
                          <p className="font-semibold">{t.sizeBand}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {formatVnd(t.priceVnd)}
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <p className="text-sm text-muted-foreground">
                  Thời lượng: {s.durationMin} phút
                </p>
                <Button asChild>
                  <Link href={`/booking/step-pet?service=${s.slug}`}>Đặt lịch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
