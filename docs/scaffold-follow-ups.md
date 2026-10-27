# Homepage scaffold — operator follow-ups

Scaffold creates the isolated app repo. Most first-apply steps below are **done**. Keep this file as the checklist for remaining ops (Grafana GitHub DS, etc.).

## Platform (`7oas7er/platform`) — cutover **done**

Live as of 2026-10-26:

1. **Apex** `7oas7er.com` → `https://www.7oas7er.com/` (301).
2. **`www.7oas7er.com` is not redirected** — serves Homepage via Cloudflare → CloudFront.
3. Origin-verify + cache host rules cover `www.7oas7er.com` and `www-stg.7oas7er.com`.
4. Shared Infinity + GitHub plugin remain in platform `shared-obs` (not recreated here).

Ownership detail: [ADR 0008](adr/0008-www-hosts-and-apex-redirect.md).

## Local Terraform (`AWS_PROFILE=7oas7er`)

```bash
export AWS_PROFILE=7oas7er
# Applied for first go-live (stg + prod):
# 1) infra/terraform/aws/bootstrap
# 2) infra/terraform/aws/envs/stg    # ACM www-stg in us-east-1
# 3) platform shared-edge           # redirect cutover + origin-verify
# 4) infra/terraform/cloudflare     # www / www-stg CNAMEs
# 5) infra/terraform/grafana
# 6) infra/terraform/aws/envs/prod  # ACM www in us-east-1
```

- [x] Fresh gitignored `terraform.tfvars` per root
- [x] Immutable OIDC subjects for Environments
- [x] GitHub Environment vars wired from Terraform outputs (stg + prod)

## GitHub

- [x] Environments `staging`, `production`, `terraform`
- [x] Ruleset `default` on `main`+`staging` (`Required CI` only)
- [x] Dependabot alerts + secret scanning + push protection (API-verified 2026-10-26)
- [x] Actions `GITHUB_TOKEN` read-only; CodeQL default setup off
- [x] Issues / Wiki / Projects off

## Verify

- [x] `https://www-stg.7oas7er.com` → 200 (Homepage)
- [x] `https://www.7oas7er.com` → 200 (Homepage)
- [x] `https://7oas7er.com` → 301 → `www`
- [ ] Raw CloudFront URL → 403 (re-check after any origin-verify rotation)

## Remaining (optional)

- [ ] Grafana `github_access_token` / CI panels if not already enabled
- [ ] Keep `projects.json` rows in sync when new apps go live
