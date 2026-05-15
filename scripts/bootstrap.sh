#!/usr/bin/env bash
set -euo pipefail

# Bootstraps a fresh local environment.
#
# Usage:  ./scripts/bootstrap.sh

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found — installing via corepack"
  corepack enable
  corepack prepare pnpm@9.12.0 --activate
fi

if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example"
  cp .env.example .env.local
fi

echo "Installing dependencies"
pnpm install

echo "Starting Postgres via docker compose"
docker compose -f docker/docker-compose.yml up -d postgres

echo "Running migrations & seed"
pnpm db:migrate
pnpm db:seed

echo
echo "Done. Run pnpm dev to start the app at http://localhost:3000"
