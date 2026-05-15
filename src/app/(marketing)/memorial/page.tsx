import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Vườn tưởng niệm',
  description: 'Những lời tiễn biệt từ các gia đình. Một không gian để tưởng nhớ.',
};
export const revalidate = 60;

export default async function MemorialWallPage() {
  const memorials = await prisma.memorial.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 24,
    include: { pet: true, _count: { select: { tributes: true } } },
  });

  return (
    <div className="container py-16">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl">Vườn tưởng niệm</h1>
        <p className="mt-4 text-muted-foreground">
          Một không gian để gia đình tưởng nhớ những người bạn nhỏ đã rời xa. Mỗi câu chuyện ở
          đây được chia sẻ với sự đồng ý của gia đình.
        </p>
      </div>

      {memorials.length === 0 ? (
        <p className="mt-12 text-muted-foreground">Chưa có bài tưởng niệm công khai.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memorials.map((m) => (
            <Card key={m.id}>
              <CardContent className="space-y-3 p-6">
                <p className="font-serif text-xl">{m.title}</p>
                <p className="text-sm text-muted-foreground">
                  {m.pet.name} · {formatDateTime(m.createdAt)}
                </p>
                <p className="line-clamp-4 text-sm">{m.body}</p>
                <Link href={`/memorial/${m.slug}`} className="text-sm text-primary underline">
                  Đọc tiếp · {m._count.tributes} lời chia sẻ
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
