import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import '@/styles/globals.css';

const sans = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://pet-farewell.vn'),
  title: {
    default: 'Pet Farewell — Dịch vụ tiễn biệt thú cưng cao cấp',
    template: '%s · Pet Farewell',
  },
  description:
    'Hỏa táng riêng, lễ tưởng niệm, và đồng hành tâm lý cho gia đình tại Hà Nội & TP.HCM. Phục vụ 24/7.',
  applicationName: 'Pet Farewell',
  authors: [{ name: 'Pet Farewell' }],
  keywords: [
    'hỏa táng thú cưng',
    'tiễn biệt chó mèo',
    'pet cremation Hà Nội',
    'pet farewell HCMC',
    'memorial cho thú cưng',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Pet Farewell',
    locale: 'vi_VN',
    alternateLocale: ['en_US'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf6ee' },
    { media: '(prefers-color-scheme: dark)', color: '#16140f' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
