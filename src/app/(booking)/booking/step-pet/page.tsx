import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking/BookingForm';
import { listServicesByCategory } from '@/server/services/catalog';

export const metadata: Metadata = {
  title: 'Đặt lịch tiễn biệt',
  description: 'Đặt lịch tiễn biệt thú cưng tại Hà Nội & TP.HCM. Đội điều phối 24/7.',
};

export default async function BookingStepPetPage() {
  const services = await listServicesByCategory();
  const visible = services.filter((s) => s.category !== 'ADD_ON' && s.category !== 'GRIEF_COUNSELING');

  return (
    <div className="container max-w-6xl">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Đặt lịch</p>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl">
          Hãy kể cho chúng tôi nghe về bé yêu của bạn
        </h1>
        <p className="mt-3 text-muted-foreground">
          Toàn bộ quá trình mất khoảng 3 phút. Đội ngũ sẽ gọi xác nhận trong vòng 30 phút.
        </p>
      </div>

      <BookingForm
        services={visible.map((s) => ({
          id: s.id,
          slug: s.slug,
          nameVi: s.nameVi,
          shortVi: s.shortVi,
          basePriceVnd: s.basePriceVnd,
          tiers: s.tiers.map((t) => ({ sizeBand: t.sizeBand, priceVnd: t.priceVnd })),
        }))}
      />
    </div>
  );
}
