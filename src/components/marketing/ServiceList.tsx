import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatVnd } from '@/lib/utils';

type ServiceCardData = {
  id: string;
  slug: string;
  nameVi: string;
  shortVi: string;
  basePriceVnd: number;
  isFeatured: boolean;
};

export function ServiceList({ services }: { services: ServiceCardData[] }) {
  return (
    <section id="services" className="container py-16">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl">Các gói dịch vụ</h2>
        <p className="mt-3 text-muted-foreground">
          Mỗi gia đình, mỗi bé yêu là duy nhất. Chúng tôi luôn tư vấn miễn phí để bạn chọn phương
          án phù hợp.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className="flex flex-col">
            <CardHeader>
              {s.isFeatured && <Badge variant="success" className="w-fit">Phổ biến</Badge>}
              <CardTitle className="font-serif">{s.nameVi}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">{s.shortVi}</p>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Từ</p>
                <p className="font-serif text-2xl">{formatVnd(s.basePriceVnd)}</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/services/${s.slug}`}>Chi tiết & đặt lịch</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
