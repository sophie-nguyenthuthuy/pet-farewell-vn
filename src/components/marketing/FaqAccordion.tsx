'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type FaqProps = {
  items: Array<{ id: string; questionVi: string; answerVi: string }>;
};

export function FaqAccordion({ items }: FaqProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="container py-16">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl">Câu hỏi thường gặp</h2>
      </div>
      <ul className="divide-y rounded-2xl border">
        {items.map((it) => {
          const open = openId === it.id;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : it.id)}
                className="flex w-full items-center justify-between gap-6 p-5 text-left"
                aria-expanded={open}
              >
                <span className="font-medium">{it.questionVi}</span>
                {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
              <div
                className={cn(
                  'overflow-hidden px-5 text-sm text-muted-foreground transition-all',
                  open ? 'max-h-96 pb-5' : 'max-h-0',
                )}
              >
                {it.answerVi}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
