# Homepage

Frank Schlesinger’s public project directory (1990s personal-homepage feel), plus the **app-owned** AWS / DNS / Grafana stack. Bootstrapped from the Block Drop / DressMe solo+AI template.

**Fundamental design:** each app is an **isolated repository**. Shared Cloudflare zone rulesets and shared Grafana Free objects (Infinity DS, GitHub plugin) live in [`7oas7er/platform`](https://github.com/7oas7er/platform). Apps depend on platform — **never on each other**.

Frontend lives under [`homepage/`](homepage/). Project rows are data-driven from [`homepage/projects.json`](homepage/projects.json). How the listing is structured: [`homepage/README.md`](homepage/README.md).

- **Architecture:** [`docs/architecture.md`](docs/architecture.md)
- **ADRs:** [`docs/adr/`](docs/adr/)
- **Agents:** [`AGENTS.md`](AGENTS.md)
- **Secrets:** [`SECURITY.md`](SECURITY.md)
- **Security floor:** [`docs/github-branch-protection.md`](docs/github-branch-protection.md)
- **Maintenance:** [`docs/maintenance.md`](docs/maintenance.md)
- **Scaffold / first apply:** [`docs/scaffold-follow-ups.md`](docs/scaffold-follow-ups.md)

## Layout

| Path | Role |
|------|------|
| [`homepage/`](homepage/) | Static listing site (`projects.json` + period HTML/CSS/JS) |
| [`tests/`](tests/) | Node unit tests + Playwright e2e; gates deploy |
| [`infra/terraform/aws/`](infra/terraform/aws/) | Site module + `envs/stg` / `envs/prod` + bootstrap |
| [`infra/terraform/cloudflare/`](infra/terraform/cloudflare/) | **DNS only** for Homepage hosts (zone rulesets → platform `shared-edge`) |
| [`infra/terraform/grafana/`](infra/terraform/grafana/) | App synthetics, CloudWatch, **prod+stg** dashboards, GitHub DS (Infinity + plugin → platform `shared-obs`; layout [`docs/grafana-dashboard-template.md`](docs/grafana-dashboard-template.md)) |
| [`infra/lambda/`](infra/lambda/) | Scaffold `/api/health` Lambda (zipped by AWS Terraform) |
| [`.cursor/rules/`](.cursor/rules/) | Platform (`app-*`) + product (`homepage-*`) Cursor rules — see [`.cursor/rules/README.md`](.cursor/rules/README.md) |
| [`.cursor/skills/`](.cursor/skills/) | Project skills (`new-app-from-template`, `gap-against-app-template`) |
| [`AGENTS.md`](AGENTS.md) | Definition of done for AI-assisted changes |
| [`docs/architecture.md`](docs/architecture.md) | App vs shared-platform ownership |
| [`docs/`](docs/) | Template backlog, ADRs, cross-cutting docs |
| [`docs/maintenance.md`](docs/maintenance.md) | Ongoing patch / Dependabot cadence |
| [`SECURITY.md`](SECURITY.md) | Reporting + secret leak / rotation pointers |

## Environments and promotion

- Feature work → PR into **`staging`** → deploys **AWS stg** only.
- Promote to production by merging **`staging` → `main`** → deploys **AWS prod**.
- GitHub Environments `staging` / `production` / `terraform` hold distinct roles and resources. Do not point both deploy envs at the same resources.

| Env | Host |
|-----|------|
| staging | `www-stg.7oas7er.com` |
| production | `www.7oas7er.com` |

Apex `7oas7er.com` redirects to `www` (platform `shared-edge`). Operator checklist: [`docs/scaffold-follow-ups.md`](docs/scaffold-follow-ups.md).

## CI / CD

| Workflow | What it does |
|----------|----------------|
| [`.github/workflows/deploy-homepage.yml`](.github/workflows/deploy-homepage.yml) | Unit + Playwright; on push to `staging`/`main`, syncs `homepage/` to S3, invalidates CloudFront, purges Cloudflare (when site paths change) |
| [`.github/workflows/terraform-plan.yml`](.github/workflows/terraform-plan.yml) | `fmt` / **Checkov** / `validate` / **plan** for changed Terraform roots (OIDC read-only plan role). **Never applies.** |
| [`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml) | `npm audit --audit-level=high` for `tests/` and `infra/lambda/` when those lockfiles change |
| [`.github/workflows/required-ci.yml`](.github/workflows/required-ci.yml) | Always-on PR check (`Required CI`) for branch rulesets (tests when site paths change; pin script) |
| [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml) | CodeQL SAST for `homepage/`, `infra/lambda/`, and Actions workflows |

Deploy auth is GitHub OIDC → env-specific IAM roles (no long-lived AWS keys in GitHub). Dependabot opens weekly PRs to `staging` for Actions, Playwright, the Lambda AWS SDK, and **Terraform providers** (per root). Ongoing cadence: [`docs/maintenance.md`](docs/maintenance.md). Branch rules: [`docs/github-branch-protection.md`](docs/github-branch-protection.md). Action SHA pins: [`docs/github-actions-pinning.md`](docs/github-actions-pinning.md). Checkov: [`docs/iac-policy.md`](docs/iac-policy.md). CodeQL: [`docs/codeql.md`](docs/codeql.md). Security headers: [`docs/security-headers.md`](docs/security-headers.md).

## Terraform (local apply)

Apply stays on your machine. Typical profile:

```bash
export AWS_PROFILE=7oas7er
```

Roots (separate state keys under `shared-homepage-terraform-state-bucket`):

- `infra/terraform/aws/bootstrap`
- `infra/terraform/aws/envs/stg` and `envs/prod`
- `infra/terraform/cloudflare` (DNS)
- `infra/terraform/grafana` (app dashboards / synthetics / CW / GitHub DS)

Plus platform roots (separate repo / state): `shared-edge`, `shared-obs` — see [`7oas7er/platform`](https://github.com/7oas7er/platform).

Never commit `.tfstate`, `terraform.tfvars`, API tokens, or AWS keys. Setup notes:

- [Architecture](docs/architecture.md)
- [Scaffold / first apply](docs/scaffold-follow-ups.md)
- [Terraform plan CI](infra/terraform/docs/terraform-plan-ci.md)
- [Origin-verify secret rotation](infra/terraform/docs/origin-verify-secret-rotation.md)
- [AWS README](infra/terraform/aws/README.md)
- [Cloudflare README](infra/terraform/cloudflare/README.md)
- [Grafana README](infra/terraform/grafana/README.md)

## Observability

**Grafana Cloud Free** only: synthetics (site + `/api/health`), CloudWatch scrape (`AWS/Lambda`, `AWS/CloudFront` incl. OriginLatency), Cloudflare edge analytics (via GraphQL into Grafana), GitHub Actions panels. Dual env dashboards: `Homepage — Production` / `Homepage — Staging`. Do not add a second monitoring SaaS. Shared Infinity + GitHub plugin: platform `shared-obs`. Cloudflare remains DNS/edge (plus analytics pulled into Grafana)—not an APM product. Layout: [`docs/grafana-dashboard-template.md`](docs/grafana-dashboard-template.md).

## Security principles

- Public traffic must arrive via **Cloudflare**; direct CloudFront (or other origin) URLs are rejected (origin-verify header gate).
- Secrets live in gitignored tfvars, GitHub Environment secrets, or env vars—not in git.
- Reporting and leak response: [`SECURITY.md`](SECURITY.md). Durable “why” for stack choices: [`docs/adr/`](docs/adr/).
- GitHub security floor (Dependabot alerts, secret scanning + push protection, ruleset, read-only `GITHUB_TOKEN`): [`docs/github-branch-protection.md`](docs/github-branch-protection.md).

## Local development

**Site:** from repo root (after `npm ci` in `tests/`):

```bash
npx --prefix tests serve homepage -l 4173
```

Details: [`homepage/README.md`](homepage/README.md).

**Tests:**

```bash
cd tests
npm ci
npx playwright install chromium
npm test
```

Details: [`tests/README.md`](tests/README.md).

**Pre-commit** (optional but recommended — catches `terraform fmt` and unit-test regressions before CI):

```bash
pipx install pre-commit   # or: brew install pre-commit
pre-commit install
pre-commit run --all-files
```

Config: [`.pre-commit-config.yaml`](.pre-commit-config.yaml). Hooks run `terraform fmt` under `infra/terraform/` and `npm run test:unit` when `tests/` or `homepage/js/` change. Full `terraform validate` stays in CI (needs init/backends).

## Working with Cursor / agents

Follow [`AGENTS.md`](AGENTS.md) and rules under [`.cursor/rules/`](.cursor/rules/) (`app-*` platform + `homepage-*` product). New app from this pattern: [`.cursor/skills/new-app-from-template/`](.cursor/skills/new-app-from-template/). Gap-analyze / migrate an existing repo: [`.cursor/skills/gap-against-app-template/`](.cursor/skills/gap-against-app-template/). Decisions: [`docs/adr/`](docs/adr/). Backlog: [`docs/template-readiness-backlog.md`](docs/template-readiness-backlog.md).
