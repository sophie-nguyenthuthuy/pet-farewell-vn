import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { logger } from './observability/logger';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function fail(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: { code, message, details } }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return fail('VALIDATION_ERROR', 'Invalid request payload', 422, err.flatten());
  }
  if (err instanceof AppError) {
    return fail(err.code, err.message, err.statusCode, err.details);
  }
  logger.error({ err }, 'Unhandled API error');
  return fail('INTERNAL_ERROR', 'An unexpected error occurred', 500);
}
