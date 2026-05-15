import '@testing-library/jest-dom/vitest';

process.env.NEXT_PUBLIC_APP_URL ??= 'http://localhost:3000';
process.env.NEXT_PUBLIC_APP_NAME ??= 'Pet Farewell';
process.env.NEXT_PUBLIC_DEFAULT_LOCALE ??= 'vi';
process.env.AUTH_SECRET ??= 'test-secret-test-secret-test-secret-test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/petfarewell_test';
process.env.LOG_LEVEL ??= 'fatal';
