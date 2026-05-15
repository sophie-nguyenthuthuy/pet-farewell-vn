import Link from 'next/link';
import { getDictionary } from '@/lib/i18n';

export function SiteFooter({ locale = 'vi' as const }: { locale?: 'vi' | 'en' }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t bg-muted/40">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-xl">{t.brand}</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{t.tagline}</p>
          <p className="mt-4 text-sm text-muted-foreground">{t.footer.address}</p>
          <p className="mt-1 text-sm font-medium">{t.footer.hotline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Dịch vụ</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/services#private">Hỏa táng riêng</Link></li>
            <li><Link href="/services#communal">Hỏa táng chung</Link></li>
            <li><Link href="/services#burial">Chôn cất vườn tưởng niệm</Link></li>
            <li><Link href="/services#memorial">Lễ tưởng niệm & livestream</Link></li>
            <li><Link href="/grief-support">Đồng hành tâm lý</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Hỗ trợ</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about">Về chúng tôi</Link></li>
            <li><Link href="/contact">Liên hệ</Link></li>
            <li><Link href="/memorial">Vườn tưởng niệm</Link></li>
            <li><Link href="/login">Đăng nhập tài khoản</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {t.brand}. {t.footer.rights}.</p>
          <div className="flex gap-4">
            <Link href="/privacy">Quyền riêng tư</Link>
            <Link href="/terms">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
