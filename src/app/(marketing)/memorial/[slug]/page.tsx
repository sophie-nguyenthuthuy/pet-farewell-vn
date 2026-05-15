import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMemorialBySlug } from '@/server/services/memorial';
import { formatDateTime } from '@/lib/utils';
import { TributeForm } from '@/components/memorial/TributeForm';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const m = await getMemorialBySlug(slug);
    return {
      title: m.title,
      description: `Tưởng niệm ${m.pet.name}`,
      openGraph: m.coverUrl ? { images: [m.coverUrl] } : undefined,
    };
  } catch {
    return { title: 'Không tìm thấy tưởng niệm' };
  }
}

export default async function MemorialDetailPage({ params }: Props) {
  const { slug } = await params;
  let memorial: Awaited<ReturnType<typeof getMemorialBySlug>>;
  try {
    memorial = await getMemorialBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="container max-w-3xl py-12">
      <header>
        <p className="text-sm uppercase tracking-wider text-muted-foreground">Tưởng niệm</p>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl">{memorial.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {memorial.pet.name} · viết bởi {memorial.author.name}
        </p>
      </header>

      <div className="prose prose-stone mt-8 max-w-none whitespace-pre-wrap">{memorial.body}</div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Lời tri ân ({memorial.tributes.length})</h2>
        <TributeForm memorialId={memorial.id} />
        <ul className="mt-6 space-y-4">
          {memorial.tributes.map((t) => (
            <li key={t.id} className="rounded-lg border p-4">
              <p className="text-sm">{t.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                — {t.authorName} · {formatDateTime(t.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
