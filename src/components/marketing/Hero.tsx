import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, ShieldCheck } from 'lucide-react';
import { getDictionary, type Locale } from '@/lib/i18n';

export function Hero({ locale = 'vi' as Locale }: { locale?: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="container py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="animate-fade-in">
          <Badge variant="secondary" className="mb-6">
            Phục vụ 24/7 · Hà Nội · TP.HCM
          </Badge>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl">{t.hero.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{t.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/booking/step-pet">{t.cta.bookNow}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:19000099">{t.cta.callNow}</a>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              {t.hero.trustBadges.private}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t.hero.trustBadges.licensed}
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t.hero.trustBadges.support}
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted via-secondary to-muted shadow-lg">
            <div className="flex h-full items-end p-8">
              <blockquote className="font-serif text-2xl italic text-foreground/90">
                "Họ đã giúp gia đình tôi tạm biệt Misa một cách trọn vẹn — điều mà tôi không
                nghĩ mình có thể tự làm được."
                <footer className="mt-3 not-italic text-sm text-muted-foreground">
                  — Chị Linh, Quận 2, TP.HCM
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
