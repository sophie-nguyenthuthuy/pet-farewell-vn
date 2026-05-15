import { describe, expect, it } from 'vitest';
import { CreateBookingSchema, PetInputSchema, ContactSchema } from '@/lib/validation';

describe('ContactSchema', () => {
  it('accepts a valid Vietnamese mobile number', () => {
    const parsed = ContactSchema.safeParse({
      fullName: 'Nguyễn An',
      email: 'an@example.com',
      phone: '0912345678',
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects an international format we do not support', () => {
    const parsed = ContactSchema.safeParse({
      fullName: 'Test',
      email: 'a@b.co',
      phone: '+1 415 555 0100',
    });
    expect(parsed.success).toBe(false);
  });
});

describe('PetInputSchema', () => {
  it('requires a sizeBand', () => {
    const parsed = PetInputSchema.safeParse({ name: 'Misa', species: 'CAT' });
    expect(parsed.success).toBe(false);
  });
});

describe('CreateBookingSchema', () => {
  const validInput = {
    contact: { fullName: 'Nguyễn An', email: 'an@example.com', phone: '0912345678' },
    pet: { name: 'Misa', species: 'CAT', sizeBand: 'S' },
    service: { serviceId: 'ckabcdefghijklmnopqrstuvw', addOnIds: [], livestream: false, griefCounseling: false },
    pickup: {
      pickupRequired: true,
      pickupAddress: '12 Lý Thường Kiệt',
      pickupCity: 'HANOI',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    acceptTerms: true,
  };

  it('accepts a fully valid booking', () => {
    const parsed = CreateBookingSchema.safeParse(validInput);
    expect(parsed.success).toBe(true);
  });

  it('rejects when terms are not accepted', () => {
    const parsed = CreateBookingSchema.safeParse({ ...validInput, acceptTerms: false });
    expect(parsed.success).toBe(false);
  });

  it('rejects bookings scheduled in the deep past', () => {
    const parsed = CreateBookingSchema.safeParse({
      ...validInput,
      pickup: { ...validInput.pickup, scheduledFor: new Date('2000-01-01') },
    });
    expect(parsed.success).toBe(false);
  });
});
