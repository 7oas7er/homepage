# Cursor rules — platform vs product

Rules split so this repo can be cloned as a **solo + AI** template without fighting product names forever.

**Naming note:** Cursor `app-*` rules are the **in-repo platform pattern** (hosting, Grafana, Terraform habits). The **GitHub platform repository** [`7oas7er/platform`](https://github.com/7oas7er/platform) is separate: shared-edge + shared-obs that all apps consume. Do not conflate the two.

| Kind | Prefix | Role |
|------|--------|------|
| **App pattern** | `app-*` | Public web app in **one AWS account**, DNS-only Cloudflare in-app, Grafana-first, Terraform SoT; depends on `7oas7er/platform` for zone rulesets + shared Infinity/plugin |
| **Product** | `homepage-*` | Project directory (`homepage/`, `www` / `www-stg` domains) |

When cloning for a new app: keep `app-*`, replace or delete `homepage-*`, wire secrets/hosts into [`7oas7er/platform`](https://github.com/7oas7er/platform), and follow the skill `.cursor/skills/new-app-from-template/`.

When **gap-analyzing or migrating** an existing repo toward this pattern: `.cursor/skills/gap-against-app-template/` (also in personal Agent Store). Architecture: [`docs/architecture.md`](../../docs/architecture.md).

## Files

| Rule | Scope |
|------|--------|
| `app-core.mdc` | always — hosting, envs, secrets, Cloudflare-only, agents |
| `app-aws-regions.mdc` | always — `eu-north-1` default |
| `app-observability.mdc` | always — Grafana pattern (dual-env dashboards: [`docs/grafana-dashboard-template.md`](../../docs/grafana-dashboard-template.md)) |
| `app-terraform.mdc` | `infra/terraform/**` — roots, state, CI plan |
| `app-deploy.mdc` | `.github/workflows/**` — OIDC deploy / promote; Action SHA pins |
| `homepage-core.mdc` | always — product + pointers to platform |
| `homepage-frontend.mdc` | `homepage/**` |
| `homepage-terraform.mdc` | `infra/terraform/**` — naming, domains, API |
| `homepage-deploy.mdc` | `.github/workflows/**` — this app’s workflow |
| `homepage-observability.mdc` | always — this app’s labels / dashboard path |
