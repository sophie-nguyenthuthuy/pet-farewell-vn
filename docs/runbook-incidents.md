# Incident runbook

> Optimised for the on-call engineer at 2am, not the architect.

## Severity definitions

- **SEV-1** — Customers can't reach us during a death-care emergency. Pickup
  dispatch, booking submission, or hotline routing is fully down.
- **SEV-2** — A degraded experience: payments failing, email confirmations not
  going out, admin console broken. Bookings can still be taken by phone.
- **SEV-3** — Cosmetic bugs, marketing-site issues, slow queries that haven't
  reached customer impact.

## First 5 minutes

1. Acknowledge in #incidents.
2. Check `/api/health` against the prod URL. If `dbLatencyMs > 1000` or
   `checks.database === false`, jump to the Postgres section.
3. Check status of upstream providers: Stripe, VNPay, Resend.
4. Check the last 10 deploys — was anything pushed in the last hour?

## Postgres

```bash
# Connection saturated?
psql $DATABASE_URL -c "select count(*) from pg_stat_activity;"

# Slow queries:
psql $DATABASE_URL -c "select query, calls, mean_exec_time from pg_stat_statements order by mean_exec_time desc limit 10;"
```

If the pooler is the issue, scale connection limits before scaling the app.

## Payments

- Stripe webhook failures → Dashboard → Developers → Webhooks → retry.
- VNPay reconciliation runs daily at 02:00 ICT; mismatches go to `#payments`.

## Mass pickup outage (SEV-1)

If the dispatcher can't be reached:
1. Post a hotline banner via Admin → Services → "Temporary message".
2. Failover to manual phone dispatch — see internal wiki.
3. Inform customers with scheduled pickups in the next 4 hours by SMS.

## Post-incident

- Open an incident doc within 24 hours.
- Identify a long-term fix and an interim mitigation (separate owners).
- Update this runbook with anything that was wrong or missing.
