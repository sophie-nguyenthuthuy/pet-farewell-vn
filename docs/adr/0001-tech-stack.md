# ADR 0001 — Technology stack

**Status:** Accepted
**Date:** 2026-05-15

## Context

We need a stack that:

1. Ships a customer-facing site with strong SEO and Core Web Vitals
   (the buyer journey starts in the dark — Google "hỏa táng thú cưng
   Hà Nội" — so first paint and trust signals matter).
2. Lets a small (≤6) full-stack team move fast across marketing pages,
   the booking wizard, the customer portal, and the admin console
   without context-switching languages or repos.
3. Speaks Vietnamese natively (locale, currency, phone validation,
   timezone).
4. Has a hiring pipeline in Vietnam (Hanoi/HCMC) — exotic stacks limit
   who we can hire.

## Decision

**Next.js 15 (App Router) + TypeScript + PostgreSQL + Prisma**, deployed
as a standalone Node container behind an HTTPS load balancer.

- **Next.js App Router** — gives us SEO-friendly server components for
  marketing and the same framework for portal/admin via Server Actions
  and route handlers. One repo, one mental model.
- **TypeScript strict** — non-negotiable on a payments + identity
  product. Catches the "we forgot to handle null" class of bug.
- **PostgreSQL** — well-understood operationally, strong managed
  options (RDS, Neon, VNG Cloud Database for Postgres).
- **Prisma** — type-safe queries, automatic migrations, Studio as a
  built-in admin tool while we're small.
- **NextAuth v5 (credentials)** — supports passwordless / OAuth in the
  future; for now, email + password is sufficient and familiar.
- **Tailwind + Radix + shadcn pattern** — primitives, not a heavy UI kit;
  lets the design team customize freely while shipping accessibly.
- **Vitest + Playwright** — vitest aligns with our toolchain (vite-style
  config, fast); Playwright covers the Server Action + redirect flow
  that JSDOM can't.
- **Docker (standalone Next output)** — distroless-ish, non-root,
  health-checked. Same image runs in dev compose and in prod.

## Considered alternatives

- **Remix** — strong ergonomics, but a smaller ecosystem in the VN
  hiring market and less mature ISR story.
- **SvelteKit** — beautiful DX, but the team's React investment and the
  ecosystem of Tailwind/Radix components tipped this.
- **Rails / Django** — fast for CRUD but creates a frontend split we
  don't have headcount to support cleanly.
- **Supabase / Firebase** — ties us to a vendor and complicates the
  payments + audit trail story.

## Consequences

- We commit to keeping up with Next.js majors. The App Router is still
  young; we accept some churn.
- We need to be disciplined about the layering rule (UI → services →
  Prisma) — it isn't enforced by the toolchain.
- Prisma's relational model maps cleanly to our schema; if we later
  need OLAP we'll add a separate warehouse rather than fighting Prisma.
