# Environment variables

All variables are validated at startup by `src/lib/env.ts`. The process
refuses to boot if a required variable is missing.

## Required

| Var                   | Notes                                          |
| --------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Public origin (e.g. `https://pet-farewell.vn`) |
| `DATABASE_URL`        | Postgres URI                                   |
| `AUTH_SECRET`         | At least 32 chars; rotate on suspected leak    |
| `AUTH_URL`            | Same as APP_URL in most setups                 |

## Recommended in production

| Var                                  | Notes                                   |
| ------------------------------------ | --------------------------------------- |
| `RESEND_API_KEY`                     | Transactional email (booking confirms)  |
| `EMAIL_FROM`                         | Defaults to `Pet Farewell <hello@…>`    |
| `EMAIL_REPLY_TO`                     | Where replies go                        |
| `STRIPE_SECRET_KEY`                  | International cards                     |
| `STRIPE_WEBHOOK_SECRET`              | Required to accept Stripe webhooks      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Used by the client checkout button      |
| `VNPAY_TMN_CODE`                     | Domestic payment (cards / QR)           |
| `VNPAY_HASH_SECRET`                  | HMAC-SHA512 secret                      |
| `VNPAY_RETURN_URL`                   | Webhook callback URL                    |
| `SMS_PROVIDER_API_KEY`               | SMS sender (eSMS, FPT, VNPT)            |
| `SMS_SENDER_ID`                      | Defaults to `PETFAREWELL`               |
| `STORAGE_*`                          | S3-compatible bucket for memorial media |
| `LOG_LEVEL`                          | `info` (default), `debug` for verbose   |
| `SENTRY_DSN`                         | Error reporting                         |
| `OTEL_EXPORTER_OTLP_ENDPOINT`        | OpenTelemetry traces                    |

## Feature flags

| Var                        | Default | Notes                     |
| -------------------------- | ------- | ------------------------- |
| `FEATURE_LIVESTREAM`       | `true`  | Booking livestream toggle |
| `FEATURE_GRIEF_COUNSELING` | `true`  | Counseling add-on         |
| `FEATURE_MEMORIAL_WALL`    | `true`  | Public tributes           |

## Verifying a deploy

```bash
pnpm tsx scripts/check-env.ts
```

Exits non-zero if any required variable is missing or `AUTH_SECRET` is
too short.
