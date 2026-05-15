# Contributing

We welcome contributions. This is a service that helps grieving families, so
quality and care come before speed.

## Getting set up

```bash
./scripts/bootstrap.sh
pnpm dev
```

## Before opening a PR

```bash
pnpm check    # lint + typecheck + unit tests
```

If you touched the data model:

```bash
pnpm db:migrate
```

…and commit the generated migration in `prisma/migrations/`.

## Coding standards

- **TypeScript strict mode.** No `any`, no `as unknown as`.
- **Server actions and API routes must validate input with Zod.** Untrusted
  data never reaches Prisma directly.
- **No console logging.** Use `logger` from `@/lib/observability/logger`.
  `warn`/`error` are allowed when there is no logger context.
- **Translations.** Add new copy to both `src/locales/vi/common.json` and
  `src/locales/en/common.json`. Vietnamese is the primary locale.
- **Currency.** All prices are integer VND. Use `formatVnd` to render.

## Commit style

Conventional Commits — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
Keep the subject line under 72 chars.

## Code of conduct

Be kind, especially when discussing features for grieving customers.
