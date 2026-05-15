import type { Metadata } from 'next';
import { MapPin, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = { title: 'Liên hệ' };

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-16">
      <h1 className="font-serif text-4xl">Liên hệ</h1>
      <p className="mt-4 text-muted-foreground">
        Hotline 24/7 luôn sẵn sàng đón nhận cuộc gọi của bạn.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Block icon={<Phone />} title="Hotline 24/7" lines={['1900 0099 (nội mạng)', '+84 (0)28 7300 0099 (quốc tế)']} />
        <Block icon={<Mail />} title="Email" lines={['hello@pet-farewell.vn', 'support@pet-farewell.vn']} />
        <Block icon={<MapPin />} title="Văn phòng Hà Nội" lines={['12 Lý Thường Kiệt', 'Hoàn Kiếm, Hà Nội']} />
        <Block icon={<MapPin />} title="Văn phòng TP.HCM" lines={['88 Nguyễn Du', 'Quận 1, TP. Hồ Chí Minh']} />
      </div>
    </div>
  );
}

function Block({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="text-primary">{icon}</div>
      <p className="mt-4 font-serif text-xl">{title}</p>
      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </div>
  );
}
