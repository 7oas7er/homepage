# Homepage

Frank Schlesinger’s public project directory (1990s personal-homepage feel), plus the **app-owned** AWS / DNS / Grafana stack. Bootstrapped from the Block Drop / DressMe solo+AI template.

**Fundamental design:** each app is an **isolated repository**. Shared Cloudflare zone rulesets and shared Grafana Free objects (Infinity DS, GitHub plugin) live in [`7oas7er/platform`](https://github.com/7oas7er/platform). Apps depend on platform — **never on each other**. Architecture: [`docs/architecture.md`](docs/architecture.md).

Frontend lives under [`homepage/`](homepage/). Project rows are data-driven from [`homepage/projects.json`](homepage/projects.json).

## Layout

| Path | Role |
|------|------|
| [`homepage/`](homepage/) | Static listing site (`projects.json` + period HTML/CSS/JS) |
| [`tests/`](tests/) | Node unit tests + Playwright e2e; gates deploy |
| [`infra/terraform/aws/`](infra/terraform/aws/) | Site module + `envs/stg` / `envs/prod` + bootstrap |
| [`infra/terraform/cloudflare/`](infra/terraform/cloudflare/) | **DNS only** for Homepage hosts (zone rulesets → platform `shared-edge`) |
| [`infra/terraform/grafana/`](infra/terraform/grafana/) | App synthetics, CloudWatch, **prod+stg** dashboards, GitHub DS |
| [`infra/lambda/`](infra/lambda/) | Scaffold `/api/health` Lambda |
| [`.cursor/rules/`](.cursor/rules/) | Platform (`app-*`) + product (`homepage-*`) |
| [`AGENTS.md`](AGENTS.md) | Definition of done for AI-assisted changes |
| [`docs/architecture.md`](docs/architecture.md) | App vs platform ownership |
| [`SECURITY.md`](SECURITY.md) | Reporting + secret leak / rotation pointers |

## Domains

| Env | Host |
|-----|------|
| staging | `www-stg.7oas7er.com` |
| production | `www.7oas7er.com` |

**Note:** platform `shared-edge` currently redirects `www` / apex → Block Drop. Cutover requires a platform redirect change (apex → `www`, stop redirecting `www`) plus origin-verify/cache hosts — see [`docs/scaffold-follow-ups.md`](docs/scaffold-follow-ups.md).

## Environments and promotion

- Feature work → PR into **`staging`** → deploys **AWS stg** only.
- Promote to production by merging **`staging` → `main`** → deploys **AWS prod**.
- GitHub Environments `staging` / `production` / `terraform` hold distinct roles and resources.

## CI / CD

| Workflow | What it does |
|----------|----------------|
| [`.github/workflows/required-ci.yml`](.github/workflows/required-ci.yml) | Required check (tests when site paths change; pin script) |
| [`.github/workflows/deploy-homepage.yml`](.github/workflows/deploy-homepage.yml) | Unit + Playwright; on push to `staging`/`main`, syncs `homepage/` to S3, invalidates CloudFront, purges Cloudflare |
| [`.github/workflows/terraform-plan.yml`](.github/workflows/terraform-plan.yml) | fmt / validate / plan / Checkov (never apply) |
| [`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml) | `npm audit` on lockfile changes |
| [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml) | CodeQL for site + Lambda JS |

## First apply

Operator checklist: [`docs/scaffold-follow-ups.md`](docs/scaffold-follow-ups.md). Do not run unpaid/destructive cloud applies without Frank’s OK.
