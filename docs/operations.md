# Operations playbook

## Deploy

We build and ship a single OCI image (`docker/Dockerfile`). The recommended
deployment paths:

- **Vercel** — push to `main`, Vercel handles build + deploy. Make sure the
  `DATABASE_URL` points to a connection pooler (PgBouncer / Neon / Supabase
  pooled URL) because Server Actions and route handlers can fan out.
- **Fly.io / Render / VPS** — `pnpm docker:build` then deploy the image.

## Migrations

```bash
pnpm db:migrate              # dev
pnpm db:migrate:deploy       # production / CI
```

Roll back manually with `prisma migrate resolve --rolled-back <migration>`.

## Observability

- **Logs.** Structured JSON via pino. In development we use `pino-pretty`.
- **Health.** `GET /api/health` returns `200` with `{ status, dbLatencyMs }`.
  Wire this into your load balancer / k8s liveness probe.
- **Tracing.** `OTEL_EXPORTER_OTLP_ENDPOINT` is reserved; OpenTelemetry
  instrumentation is not yet wired (planned).
- **Errors.** Set `SENTRY_DSN` to enable Sentry once the SDK is added.

## Common ops tasks

| Task | Command |
| --- | --- |
| Tail prod logs | `fly logs` / `vercel logs` |
| Hot-fix a stuck booking | `pnpm db:studio` → `Booking` table |
| Re-send confirmation email | trigger via admin console (planned) |
| Rotate `AUTH_SECRET` | deploy with new secret; all sessions are invalidated |

## On-call runbook (skeleton)

1. Customer can't book — check `/api/health`, then the Prisma logs for
   constraint violations on `Booking`.
2. Webhook backlog — Stripe and VNPay both retry. Check
   `BookingEvent.payload` for the most recent failure reason.
3. Cremation facility offline — staff toggle `Service.isActive = false` from
   the admin console; site shows an "unavailable" message automatically.
