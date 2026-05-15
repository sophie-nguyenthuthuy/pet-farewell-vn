# Architecture

## High-level

```
                ┌─────────────────────────────────────────┐
                │              Browser / Mobile           │
                └───────────────┬─────────────────────────┘
                                │ HTTPS
                ┌───────────────▼─────────────────────────┐
                │            Next.js 15 (App Router)      │
                │  RSC · Server Actions · Route Handlers  │
                └───┬────────────┬────────────┬───────────┘
                    │            │            │
            ┌───────▼──┐  ┌──────▼─────┐ ┌────▼─────────┐
            │ Postgres │  │ Stripe /   │ │   Resend     │
            │ (Prisma) │  │ VNPay      │ │  (email)     │
            └──────────┘  └────────────┘ └──────────────┘
```

## Request lifecycle (booking submission)

1. Customer fills `<BookingForm />` (client component, React state).
2. Submit handler validates with `CreateBookingSchema` (Zod) locally for fast UX.
3. On success, the form posts a `FormData` payload to the
   `submitBookingAction` **Server Action**.
4. The action re-validates (defense in depth), then calls
   `createBooking()` in `src/server/services/bookings.ts`.
5. Inside a Prisma transaction we:
   - upsert the customer (`User`),
   - create the `Pet`,
   - price the booking (`quote()` reads `Service` + `ServiceTier`),
   - create the `Booking` with `BookingItem`s and an audit `BookingEvent`.
6. Fire-and-forget transactional email through Resend.
7. Redirect to `/booking/success?code=…`.

## Payment lifecycle

1. Customer is redirected to Stripe Checkout or VNPay (depending on choice).
2. Provider posts to `/api/webhooks/stripe` or `/api/webhooks/vnpay`.
3. Signature is verified inside the route. We then record a `Payment` row and
   transition `Booking.status` to `CONFIRMED` in a single transaction.
4. The booking audit trail records `payment_succeeded`/`payment_failed`.

## Why Server Actions instead of REST?

For form-driven flows (booking, memorial creation, login), Server Actions
remove the need for a separate API layer, get progressive enhancement for
free (forms work without JS), and let us keep the validation schema in a
single place. REST endpoints (`/api/bookings`, `/api/services`) exist for
mobile, partner integrations, and ops tooling.

## Pricing model

Each `Service` has a `basePriceVnd` and up to five `ServiceTier` rows keyed by
pet `sizeBand`. The pricing service (`src/server/services/pricing.ts`) is the
single source of truth — both the booking summary in the UI and the booking
creation path use it. Add-on services (`ADD_ON`, `GRIEF_COUNSELING`) ignore the
size band and use `basePriceVnd` directly.

## Background work (future)

Currently all work is synchronous within the request. Planned async work:

- Email retries (Resend → SQS/BullMQ)
- Webhook delivery to partner clinics
- Memorial wall photo processing (image resize → S3)

`src/server/jobs/` is reserved for these workers when added.
