# ADR 0008 — www hosts + apex redirect ownership

- **Status:** accepted (pending platform apply)
- **Date:** 2026-10-26

## Context

Homepage production/staging hosts are `www.7oas7er.com` / `www-stg.7oas7er.com`. Platform `shared-edge` historically redirected both apex and `www` to Block Drop.

## Decision

- This app owns **DNS CNAMEs** for `www` and `www-stg` (Cloudflare DNS-only root).
- Platform owns zone **redirect** rules: apex `7oas7er.com` → `https://www.7oas7er.com…`; do **not** redirect `www` once Homepage is live.
- Origin-verify and cache host rules for both Homepage hosts live in platform `shared-edge`.

## Consequences

Prod cutover is a coordinated platform apply + Homepage DNS/ACM. Do not apply redirect changes without Frank’s OK — it changes live apex/`www` traffic.
