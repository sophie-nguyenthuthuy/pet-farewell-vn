# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Initial production-grade scaffold: Next.js 15 App Router, Prisma data model,
  multi-step booking flow, Stripe + VNPay payment adapters, memorial wall,
  admin console, transactional email via Resend, i18n (vi/en).
- CI (lint + typecheck + unit + build), Playwright E2E workflow, CodeQL,
  Dependabot.
- Docker production image + docker-compose for local Postgres.
- Architecture, operations, and incident runbook docs.
