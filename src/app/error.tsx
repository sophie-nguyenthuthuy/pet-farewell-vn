'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-3xl">Đã có lỗi xảy ra</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Chúng tôi rất tiếc vì sự bất tiện. Vui lòng thử lại — nếu vẫn không được, hãy gọi hotline
        1900 0099.
      </p>
      <Button onClick={reset} className="mt-6">
        Thử lại
      </Button>
    </div>
  );
}
