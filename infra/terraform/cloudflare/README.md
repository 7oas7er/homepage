# Cloudflare — Homepage (DNS only)

Manages DNS for `www.7oas7er.com` and `www-stg.7oas7er.com` on zone `7oas7er.com`.

Does **not** manage zone apex (`7oas7er.com`) or zone rulesets. Apex redirect + origin-verify + cache live in platform `shared-edge`:

https://github.com/7oas7er/platform → `infra/terraform/shared-edge`

**Cutover note:** until platform stops redirecting `www` → Block Drop, a `www` CNAME alone will not serve this app. See `docs/scaffold-follow-ups.md` and ADR 0008.

```bash
export AWS_PROFILE=7oas7er
export CLOUDFLARE_API_TOKEN=…   # Zone.DNS Edit + Zone.Read (+ Cache Purge for deploy)
cd infra/terraform/cloudflare
terraform init && terraform apply
```
