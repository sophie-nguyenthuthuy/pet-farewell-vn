import { describe, expect, it } from 'vitest';
import { slugify, memorialSlug } from '@/lib/utils';

describe('slugify', () => {
  it('removes Vietnamese diacritics', () => {
    expect(slugify('Bé Mèo Nhỏ Đáng Yêu')).toBe('be-meo-nho-dang-yeu');
  });

  it('trims surrounding dashes', () => {
    expect(slugify('  Hello World!  ')).toBe('hello-world');
  });
});

describe('memorialSlug', () => {
  it('combines a slug with the provided suffix', () => {
    expect(memorialSlug('Misa', 'abc123')).toBe('misa-abc123');
  });
});
