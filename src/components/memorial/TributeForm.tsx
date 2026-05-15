'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function TributeForm({ memorialId }: { memorialId: string }) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!authorName.trim() || !message.trim()) {
      setError('Vui lòng điền đủ tên và lời nhắn');
      return;
    }
    startTransition(async () => {
      const res = await fetch('/api/memorial/tributes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ memorialId, authorName, message }),
      });
      const json = (await res.json()) as { ok: boolean; error?: { message: string } };
      if (!json.ok) {
        setError(json.error?.message ?? 'Không gửi được');
        return;
      }
      setAuthorName('');
      setMessage('');
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium">Để lại lời tri ân</p>
      <div>
        <Label htmlFor="t-name">Tên của bạn</Label>
        <Input id="t-name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="t-msg">Lời nhắn</Label>
        <Textarea id="t-msg" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Đang gửi…' : 'Gửi lời tri ân'}
      </Button>
    </form>
  );
}
