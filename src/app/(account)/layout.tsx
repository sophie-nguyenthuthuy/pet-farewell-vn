import { SiteHeader } from '@/components/layout/SiteHeader';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-10">{children}</main>
    </div>
  );
}
