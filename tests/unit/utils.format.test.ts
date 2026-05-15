import { describe, expect, it } from 'vitest';
import { formatVnd, bookingCode } from '@/lib/utils';

describe('formatVnd', () => {
  it('formats integers as VND currency', () => {
    expect(formatVnd(3_500_000)).toMatch(/3\.500\.000/);
  });

  it('handles zero', () => {
    expect(formatVnd(0)).toContain('0');
  });
});

describe('bookingCode', () => {
  it('zero-pads to six digits and includes year', () => {
    expect(bookingCode(42, 2026)).toBe('BK-2026-000042');
  });
});
