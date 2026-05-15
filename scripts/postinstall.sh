#!/usr/bin/env bash
set -euo pipefail

# Generate the Prisma client after dependency install so dev tooling has types ready.
if [ -f prisma/schema.prisma ]; then
  pnpm prisma generate
fi
