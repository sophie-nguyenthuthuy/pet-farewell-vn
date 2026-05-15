import { describe, expect, it } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  it('allows up to max requests in the window', () => {
    const key = `t:${Math.random()}`;
    const opts = { windowMs: 60_000, max: 3 };
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(false);
  });

  it('reports remaining requests accurately', () => {
    const key = `t:${Math.random()}`;
    const opts = { windowMs: 60_000, max: 5 };
    expect(rateLimit(key, opts).remaining).toBe(4);
    expect(rateLimit(key, opts).remaining).toBe(3);
  });

  it('resets after the window expires', async () => {
    const key = `t:${Math.random()}`;
    const opts = { windowMs: 5, max: 1 };
    expect(rateLimit(key, opts).ok).toBe(true);
    expect(rateLimit(key, opts).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 10));
    expect(rateLimit(key, opts).ok).toBe(true);
  });
});
