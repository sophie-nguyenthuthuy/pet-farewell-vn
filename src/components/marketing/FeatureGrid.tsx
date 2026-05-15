import { Truck, Flame, Camera, Gift, HeartHandshake, TreePine } from 'lucide-react';
import { getDictionary, type Locale } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

const icons = {
  pickup: Truck,
  private: Flame,
  ceremony: Camera,
  urn: Gift,
  grief: HeartHandshake,
  memorial: TreePine,
} as const;

export function FeatureGrid({ locale = 'vi' as Locale }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const keys: Array<keyof typeof icons> = ['pickup', 'private', 'ceremony', 'urn', 'grief', 'memorial'];

  return (
    <section className="container py-16">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl">Một quy trình trọn vẹn, dịu dàng</h2>
        <p className="mt-3 text-muted-foreground">
          Từ giây phút đầu tiên đến khi tro cốt được trao trả — gia đình bạn không bao giờ phải
          tự xoay xở.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((key) => {
          const Icon = icons[key];
          const feature = t.features[key];
          return (
            <Card key={key} className="border-muted-foreground/10">
              <CardContent className="p-6">
                <Icon className="h-7 w-7 text-primary" />
                <p className="mt-4 font-serif text-lg">{feature.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
