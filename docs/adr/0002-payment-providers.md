# ADR 0002 — Payment providers

**Status:** Accepted
**Date:** 2026-05-15

## Context

The booking flow needs to collect payment online so the dispatch team
isn't chasing cash on arrival, and so the customer has a receipt.

Vietnamese customers overwhelmingly pay via:

1. Domestic ATM cards routed through NAPAS (VNPay aggregates this).
2. E-wallets — MoMo, ZaloPay (also via VNPay for many merchants).
3. International credit cards (the upper-mid market, expats, returning
   diaspora) — these don't reliably work through VNPay.

Bank transfer + cash on delivery remain available as offline options.

## Decision

Support **both Stripe and VNPay** in production:

- **VNPay** for domestic ATM, QR, and e-wallet flows.
- **Stripe** for international card payments.

Both are wired through the same `recordPayment` server service, which
guarantees:

- Idempotency (duplicate webhooks no-op via `providerRef` unique index).
- Amount verification (a tampered amount is rejected).
- A `BookingEvent` audit row for every state change.

Customer chooses provider on the confirmation step; failed payments
keep the booking in `PENDING_PAYMENT` and surface a retry CTA.

## Considered alternatives

- **VNPay only** — cuts off ~10% of high-LTV customers (expats and
  returning diaspora) who can't easily get a domestic card.
- **Stripe only** — Stripe doesn't process most domestic Vietnamese
  cards and adds 1.5–3% on currency conversion that the customer sees.
- **MoMo direct** — adds a second domestic provider with overlapping
  coverage. Defer until we have data on customer preference.

## Consequences

- Two integration code paths to maintain. We mitigate with shared
  `recordPayment` and a uniform `Payment` table.
- VNPay's HMAC-SHA512 callback is GET-based and replayable; the unique
  constraint on `providerRef` plus the audit trail make this safe.
- We ship a feature flag (`FEATURE_PAYMENT_VNPAY`, future) to
  temporarily disable a provider during incidents.
