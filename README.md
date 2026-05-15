# Pet Farewell VN

> Premium pet farewell, cremation, and memorial service for urban Vietnamese families.
> Hỏa táng riêng, lễ tiễn biệt, livestream, hũ tro thủ công và đồng hành tâm lý — phục vụ Hà Nội & TP.HCM 24/7.

[![CI](https://github.com/your-org/pet-farewell-vn/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/pet-farewell-vn/actions/workflows/ci.yml)
[![CodeQL](https://github.com/your-org/pet-farewell-vn/actions/workflows/codeql.yml/badge.svg)](https://github.com/your-org/pet-farewell-vn/actions/workflows/codeql.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

---

## Why this exists

Pet ownership is exploding in Vietnamese cities, but when a pet passes, families
are left to coordinate DIY cremations through Facebook groups. The market is
crying out for a trustworthy premium service: discreet home pickup, **private**
cremation (one pet, one chamber), handcrafted urns, livestreamed ceremonies for
remote family, and trained grief counseling.

This repository is the production codebase for that service — booking platform,
admin console, payment integration, and customer-facing memorial wall.

## Feature overview

| Area | What's in the box |
| --- | --- |
| Public site | Home, services catalog, transparent pricing tables, memorial wall, grief support, contact |
| Booking | 4-step guided flow with pet details, service selection, pickup scheduling, size-based pricing |
| Account | Customer dashboard, booking history, profile, memorial creation |
| Admin | Booking pipeline, customer/service/payment dashboards, role-gated routes |
| Payments | Stripe Checkout (international) + VNPay (domestic cards, QR, e-wallets), idempotent webhooks |
| Email | Transactional confirmations via Resend (graceful no-op if unconfigured) |
| Memorial | Public tribute wall with shareable per-pet pages and visitor messages |
| i18n | Vietnamese (primary) and English |
| Observability | Structured pino logs with PII redaction, `/api/health` liveness probe, request IDs |
| Security | HSTS + standard hardening headers, server-only Prisma client, NextAuth JWT sessions, Zod validation at every boundary |

## Tech stack

- **App** — [Next.js 15](https://nextjs.org/) (App Router, Server Actions, RSC), React 19, TypeScript strict
- **UI** — Tailwind CSS, Radix primitives, Lucide icons, custom design tokens
- **Data** — PostgreSQL 16 + [Prisma](https://www.prisma.io/) 5
- **Auth** — [NextAuth v5](https://authjs.dev/) (credentials + JWT)
- **Validation** — [Zod](https://zod.dev/) everywhere (forms, server actions, API routes)
- **Payments** — Stripe + VNPay (HMAC-SHA512 signed)
- **Email** — Resend
- **Testing** — Vitest + Testing Library (unit) · Playwright (e2e)
- **Tooling** — ESLint flat config, Prettier, lint-staged + husky, Docker, GitHub Actions, CodeQL

## Quick start

```bash
# 1. Bootstrap (installs deps, starts Postgres, runs migrations, seeds catalog)
./scripts/bootstrap.sh

# 2. Run the app
pnpm dev
```

Then visit <http://localhost:3000>.

Default admin (after seed): `admin@pet-farewell.vn` / `changeme-in-production`

### Manual setup

```bash
cp .env.example .env.local        # fill in secrets
pnpm install
docker compose -f docker/docker-compose.yml up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Common commands

```bash
pnpm dev               # start Next.js with Turbopack
pnpm build             # production build (runs prisma generate first)
pnpm start             # serve the production build
pnpm lint              # ESLint (max-warnings=0)
pnpm typecheck         # tsc --noEmit
pnpm test              # Vitest unit + integration
pnpm test:coverage     # with v8 coverage report
pnpm test:e2e          # Playwright end-to-end
pnpm check             # lint + typecheck + test (run before pushing)
pnpm db:studio         # Prisma Studio data browser
pnpm db:reset          # drop + recreate schema (dev only!)
pnpm docker:build      # build production image
pnpm docker:up         # bring up the full stack
```

## Architecture at a glance

```
src/
├── app/                         # Next.js App Router
│   ├── (marketing)/             # public marketing surface
│   ├── (booking)/               # multi-step booking flow
│   ├── (account)/               # customer dashboard
│   ├── (admin)/                 # staff/admin console (role-gated)
│   └── api/                     # health, services, bookings, webhooks
├── components/
│   ├── ui/                      # primitive UI (Button, Card, Input, …)
│   ├── layout/                  # SiteHeader / SiteFooter
│   ├── marketing/               # Hero, FeatureGrid, ServiceList, FAQ, CTA
│   └── booking/                 # BookingForm with summary aside
├── lib/
│   ├── auth/                    # NextAuth + guards
│   ├── db/                      # Prisma client singleton
│   ├── email/                   # Resend client + templates
│   ├── env.ts                   # Zod-validated runtime config
│   ├── i18n/                    # vi / en dictionaries
│   ├── observability/           # pino logger with PII redaction
│   ├── payments/                # Stripe + VNPay adapters
│   ├── utils/                   # cn, formatVnd, phone, slug, …
│   └── validation/              # Zod schemas (booking, memorial)
├── server/
│   ├── actions/                 # Server Actions (form-driven)
│   └── services/                # bookings, catalog, pricing
├── locales/                     # JSON message catalogs (vi, en)
└── styles/globals.css           # Tailwind layers + design tokens
prisma/
├── schema.prisma                # data model
└── seed.ts                      # service catalog + FAQ + admin user
```

### Data model highlights

- `User` — customers, staff, counselors, admins (single table, role-based)
- `Pet` — each pet is linked to its owner and may have a `Memorial`
- `Service` + `ServiceTier` — catalog with size-band pricing (XS/S/M/L/XL)
- `Booking` — full lifecycle (`DRAFT → PENDING_PAYMENT → CONFIRMED → IN_PROGRESS → COMPLETED`), with `BookingEvent` audit trail
- `Payment` — multi-provider (Stripe, VNPay, MoMo, bank transfer, cash) with `providerRef` uniqueness for idempotency
- `Memorial` + `Tribute` — public memorial wall, slug-addressable
- `CounselingSession` — grief counseling appointments

## Configuration

All runtime configuration is loaded through [`src/lib/env.ts`](src/lib/env.ts)
and validated with Zod at process start. **Missing or malformed env vars fail
fast at boot** — no half-configured production deploys.

See [`.env.example`](.env.example) for the full list. Required for boot:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `AUTH_SECRET` (≥32 chars; `openssl rand -base64 32`)

Optional (gracefully degraded if absent): Stripe, VNPay, Resend, Sentry.

## Security posture

- **Validation at every boundary.** Forms, server actions, and API routes all
  parse input through Zod before touching the database.
- **Secrets never logged.** Pino is configured with field-path redaction for
  `authorization`, `cookie`, `password`, `hashedPassword`, `token`, `secret`.
- **Webhook signature verification.** Stripe signatures via
  `stripe.webhooks.constructEvent`; VNPay via HMAC-SHA512 (`verifyVnpaySignature`).
- **HTTP hardening.** HSTS, `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
  restrictive `Permissions-Policy`.
- **Authentication.** NextAuth v5 with bcrypt-hashed passwords (cost 12) and
  JWT sessions; admin/staff routes are role-gated in the admin layout.
- **SAST.** CodeQL runs on push, PR, and weekly cron.

## Deployment

The repo ships a production-ready multi-stage `Dockerfile` (Node 20 slim, runs
as non-root, baked Prisma client, container healthcheck) and a Compose file
suitable for VPS or self-hosted deploys. The Next.js `output: 'standalone'`
keeps the runtime image lean.

Vercel and Fly.io both deploy this layout without configuration changes.

## Compliance & operational notes

- Cremation emissions follow QCVN 30:2012/BTNMT (Vietnam national standard for
  waste incinerators); operational addendum lives in `docs/compliance.md` (not
  committed publicly).
- Customer PII is encrypted at rest via Postgres-level encryption; pickup
  addresses are kept only for the duration of the booking + 90 days for legal
  reconciliation.
- The grief counseling track must only be staffed by counselors with provable
  pet-bereavement training — admin role enforcement is the technical control;
  HR-side credentialing is the policy control.

## License

Apache License 2.0. See [LICENSE](LICENSE).

## Acknowledgements

Built with care for families who deserve a better goodbye than a Facebook DM.
