/**
 * Validates that the current process has every variable required for prod.
 * Run as part of release verification: `pnpm tsx scripts/check-env.ts`.
 *
 * Exits with non-zero status if anything is missing — safe to chain in CD.
 */

const REQUIRED_PROD = ['DATABASE_URL', 'AUTH_SECRET', 'AUTH_URL', 'NEXT_PUBLIC_APP_URL'] as const;

const RECOMMENDED_PROD = [
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'VNPAY_TMN_CODE',
  'VNPAY_HASH_SECRET',
  'SENTRY_DSN',
] as const;

const env = process.env;
let hadError = false;

for (const key of REQUIRED_PROD) {
  if (!env[key]) {
    console.error(`✗ MISSING required env: ${key}`);
    hadError = true;
  }
}

for (const key of RECOMMENDED_PROD) {
  if (!env[key]) {
    console.warn(`! MISSING recommended env: ${key}`);
  }
}

if (env.AUTH_SECRET && env.AUTH_SECRET.length < 32) {
  console.error(`✗ AUTH_SECRET must be at least 32 characters`);
  hadError = true;
}

if (hadError) {
  process.exit(1);
}

console.warn('✓ Environment looks good');
