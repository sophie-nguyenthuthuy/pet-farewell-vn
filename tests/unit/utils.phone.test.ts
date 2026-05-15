import { describe, expect, it } from 'vitest';
import { isValidVietnamesePhone, normalizeVietnamesePhone } from '@/lib/utils';

describe('isValidVietnamesePhone', () => {
  it('accepts valid mobile prefixes', () => {
    expect(isValidVietnamesePhone('0912345678')).toBe(true);
    expect(isValidVietnamesePhone('+84912345678')).toBe(true);
  });

  it('rejects bad formats', () => {
    expect(isValidVietnamesePhone('123')).toBe(false);
    expect(isValidVietnamesePhone('+1 415 555 0100')).toBe(false);
  });
});

describe('normalizeVietnamesePhone', () => {
  it('returns a canonical form for a valid number', () => {
    const result = normalizeVietnamesePhone('+84 912 345 678');
    expect(result).toBe('0912345678');
  });
});
