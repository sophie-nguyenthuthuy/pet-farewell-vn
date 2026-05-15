import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Đồng hành tâm lý',
  description: 'Hỗ trợ tâm lý cho gia đình sau khi mất thú cưng — riêng tư, chuyên môn.',
};

export default function GriefSupportPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-serif text-4xl">Bạn không phải đi qua điều này một mình</h1>
      <p className="mt-4 text-muted-foreground">
        Mất một người bạn nhỏ là mất mát thật. Đội ngũ chuyên gia tâm lý của chúng tôi được đào
        tạo riêng cho mất mát thú cưng (pet bereavement) và đồng hành cùng bạn theo nhịp của riêng
        bạn.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="font-serif text-xl">Phiên 1:1</p>
            <p className="mt-2 text-sm text-muted-foreground">
              60 phút với chuyên gia tâm lý, qua video hoặc trực tiếp. Bảo mật tuyệt đối.
            </p>
            <p className="mt-3 font-medium">Từ 1.500.000đ / phiên</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="font-serif text-xl">Nhóm hỗ trợ cộng đồng</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Buổi gặp gỡ hàng tháng (miễn phí) cho các gia đình đã trải qua mất mát tương tự.
            </p>
            <p className="mt-3 font-medium">Miễn phí · đăng ký trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <Button asChild size="lg">
          <Link href="/contact?subject=grief-counseling">Đặt buổi tư vấn</Link>
        </Button>
      </div>
    </div>
  );
}
