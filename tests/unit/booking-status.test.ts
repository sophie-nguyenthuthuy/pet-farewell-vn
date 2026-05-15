import { describe, expect, it } from 'vitest';
import { BookingStatus } from '@prisma/client';
import { isValidTransition } from '@/server/services/booking-status';

describe('isValidTransition', () => {
  it('permits the happy path', () => {
    expect(isValidTransition(BookingStatus.DRAFT, BookingStatus.PENDING_PAYMENT)).toBe(true);
    expect(isValidTransition(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED)).toBe(true);
    expect(isValidTransition(BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS)).toBe(true);
    expect(isValidTransition(BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED)).toBe(true);
    expect(isValidTransition(BookingStatus.COMPLETED, BookingStatus.REFUNDED)).toBe(true);
  });

  it('allows cancellation from any non-terminal state', () => {
    expect(isValidTransition(BookingStatus.DRAFT, BookingStatus.CANCELLED)).toBe(true);
    expect(isValidTransition(BookingStatus.PENDING_PAYMENT, BookingStatus.CANCELLED)).toBe(true);
    expect(isValidTransition(BookingStatus.CONFIRMED, BookingStatus.CANCELLED)).toBe(true);
    expect(isValidTransition(BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED)).toBe(true);
  });

  it('rejects illegal transitions', () => {
    expect(isValidTransition(BookingStatus.COMPLETED, BookingStatus.DRAFT)).toBe(false);
    expect(isValidTransition(BookingStatus.CANCELLED, BookingStatus.CONFIRMED)).toBe(false);
    expect(isValidTransition(BookingStatus.REFUNDED, BookingStatus.COMPLETED)).toBe(false);
    expect(isValidTransition(BookingStatus.PENDING_PAYMENT, BookingStatus.IN_PROGRESS)).toBe(false);
  });
});
