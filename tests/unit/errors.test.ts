import { describe, expect, it } from 'vitest';
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/errors';

describe('AppError hierarchy', () => {
  it('NotFoundError formats the resource name', () => {
    const e = new NotFoundError('Booking');
    expect(e.statusCode).toBe(404);
    expect(e.message).toContain('Booking');
    expect(e).toBeInstanceOf(AppError);
  });

  it('ValidationError carries details', () => {
    const e = new ValidationError('bad', { field: 'email' });
    expect(e.statusCode).toBe(422);
    expect(e.details).toEqual({ field: 'email' });
  });

  it('UnauthorizedError defaults to 401', () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
  });

  it('ForbiddenError defaults to 403', () => {
    expect(new ForbiddenError().statusCode).toBe(403);
  });

  it('ConflictError uses 409', () => {
    expect(new ConflictError('dup').statusCode).toBe(409);
  });

  it('RateLimitError carries retryAfter and uses 429', () => {
    const e = new RateLimitError(30);
    expect(e.statusCode).toBe(429);
    expect(e.details).toEqual({ retryAfterSeconds: 30 });
  });
});
