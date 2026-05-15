import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Pet Farewell'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['vi', 'en']).default('vi'),

  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 chars'),
  AUTH_URL: z.string().url().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Pet Farewell <hello@pet-farewell.vn>'),
  EMAIL_REPLY_TO: z.string().email().optional(),

  // Payments
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VNPAY_TMN_CODE: z.string().optional(),
  VNPAY_HASH_SECRET: z.string().optional(),
  VNPAY_RETURN_URL: z.string().url().optional(),

  // Telephony (SMS)
  SMS_PROVIDER_API_KEY: z.string().optional(),
  SMS_SENDER_ID: z.string().default('PETFAREWELL'),

  // Storage (S3-compatible)
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_REGION: z.string().default('ap-southeast-1'),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),

  // Observability
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),

  // Feature flags
  FEATURE_LIVESTREAM: z.coerce.boolean().default(true),
  FEATURE_GRIEF_COUNSELING: z.coerce.boolean().default(true),
  FEATURE_MEMORIAL_WALL: z.coerce.boolean().default(true),
});

type EnvSchema = z.infer<typeof envSchema>;

function loadEnv(): EnvSchema {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return parsed.data;
}

export const env = loadEnv();
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
