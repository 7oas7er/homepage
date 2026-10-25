# Homepage scaffold — operator follow-ups

Scaffold creates the isolated app repo. These steps are **not** done by the first PR alone. **Do not** run unpaid/destructive cloud applies without Frank’s OK.

## Platform (`7oas7er/platform`) — decision + patch

**Conflict:** `shared-edge` `redirects.tf` currently sends `www.7oas7er.com` and `7oas7er.com` → `https://blockdrop.7oas7er.com…`. Homepage prod host is `www.7oas7er.com`.

Proposed cutover (Frank must confirm before apply):

1. Change redirect: **apex only** (`7oas7er.com`) → `https://www.7oas7er.com` + path/query.
2. **Stop** redirecting `www.7oas7er.com` (it becomes Homepage origin).
3. Add origin-verify secrets for `www.7oas7er.com` and `www-stg.7oas7er.com` (tfvars + variables + rules).
4. Add cache host rule for those hostnames (respect origin Cache-Control).
5. Apply `shared-edge` **before** relying on the CloudFront origin-verify gate for Homepage.
6. Confirm shared Infinity + GitHub plugin still from `shared-obs` (do not recreate in this app).

Concrete file edits are summarized in the agent report under the Project store `internal/` folder.

## Local Terraform (`AWS_PROFILE=7oas7er`) — wait for OK

```bash
export AWS_PROFILE=7oas7er
# 1) infra/terraform/aws/bootstrap   # state bucket shared-homepage-terraform-state-bucket
# 2) infra/terraform/aws/envs/stg    # after ACM cert for www-stg.7oas7er.com in us-east-1
# 3) platform shared-edge            # after Frank OK on redirect cutover + secrets
# 4) infra/terraform/cloudflare      # DNS CNAMEs for www / www-stg
# 5) infra/terraform/grafana
# 6) infra/terraform/aws/envs/prod   # after stg proven + ACM for www.7oas7er.com
```

- [ ] Fresh gitignored `terraform.tfvars` per root (never copy DressMe/Block Drop secrets)
- [ ] Prefer immutable OIDC subjects: `repo:7oas7er@2952810/homepage@<repo_id>:environment:…`
- [ ] Wire GitHub Environment vars from Terraform outputs after apply

## GitHub

- [ ] Environments `staging`, `production`, `terraform`
- [ ] Ruleset `default` on `main`+`staging` (`Required CI` only)
- [ ] Dependabot alerts + secret scanning + push protection (API-verify)
- [ ] Actions `GITHUB_TOKEN` read-only; CodeQL default setup off
- [ ] Issues / Wiki / Projects off (static app preference)

## Verify (after applies)

- [ ] `https://www-stg.7oas7er.com` → 200
- [ ] Raw CloudFront URL → 403 (origin-verify)
- [ ] After prod cutover: `https://www.7oas7er.com` → Homepage; `https://7oas7er.com` → redirect to www
