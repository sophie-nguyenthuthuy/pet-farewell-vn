import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm uppercase tracking-wider text-muted-foreground">404</p>
      <h1 className="mt-2 font-serif text-4xl">Không tìm thấy trang</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Trang bạn tìm có thể đã được dời hoặc không còn tồn tại.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
