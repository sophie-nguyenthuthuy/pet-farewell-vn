import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n';
import { Phone } from 'lucide-react';

export function SiteHeader({ locale = 'vi' as const }: { locale?: 'vi' | 'en' }) {
  const t = getDictionary(locale);

  const nav = [
    { href: '/services', label: t.nav.services },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/memorial', label: t.nav.memorial },
    { href: '/grief-support', label: t.nav.griefSupport },
    { href: '/about', label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <span className="font-serif text-lg">PF</span>
          </span>
          <span className="font-serif text-lg">{t.brand}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:19000099"
            className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:flex"
          >
            <Phone className="h-4 w-4" />
            1900 0099
          </a>
          <Button asChild>
            <Link href="/booking/step-pet">{t.cta.bookNow}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
