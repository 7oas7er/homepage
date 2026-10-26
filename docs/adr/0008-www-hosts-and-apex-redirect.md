# ADR 0008 — www hosts + apex redirect ownership

- **Status:** accepted (applied)
- **Date:** 2026-10-26

## Context

Homepage production/staging hosts are `www.7oas7er.com` / `www-stg.7oas7er.com`. Platform `shared-edge` historically redirected both apex and `www` to Block Drop.

## Decision

- This app owns **DNS CNAMEs** for `www` and `www-stg` (Cloudflare DNS-only root).
- Platform owns zone **redirect** rules: apex `7oas7er.com` → `https://www.7oas7er.com…`; do **not** redirect `www` once Homepage is live.
- Origin-verify and cache host rules for both Homepage hosts live in platform `shared-edge`.

## Consequences

Cutover applied: `www` / `www-stg` serve Homepage; apex 301s to `www`. Further redirect or origin-verify changes still need Frank’s OK — they affect live zone traffic.
