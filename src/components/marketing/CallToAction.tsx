import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="container py-16">
      <div className="overflow-hidden rounded-2xl bg-accent px-6 py-12 text-accent-foreground md:px-12 md:py-16">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Khi bạn sẵn sàng, chúng tôi luôn ở đây</h2>
            <p className="mt-3 max-w-md text-accent-foreground/85">
              Đường dây điều phối 24/7. Xe đón có mặt trong vòng 60 phút tại khu vực nội thành Hà
              Nội và TP.HCM.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" variant="default">
              <Link href="/booking/step-pet">Đặt lịch trực tuyến</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent">
              <a href="tel:19000099">Gọi 1900 0099</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
