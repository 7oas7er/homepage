# Architecture — Homepage in the solo+AI platform

## Fundamental split

**Each app is an isolated repository.** Shared multi-tenant edge and Grafana Free objects live in [`7oas7er/platform`](https://github.com/7oas7er/platform). This app depends on platform; it must **not** be a dependency of Block Drop, Netrunner, DressMe, or any sibling.

```text
7oas7er/platform  (shared-edge, shared-obs)
        ▲
        │  app → platform only
        │
   homepage (this repo)     block-drop / netrunner / dressme / …
```

Full platform write-up: [platform docs/architecture.md](https://github.com/7oas7er/platform/blob/main/docs/architecture.md). Decision: [ADR 0007](adr/0007-shared-edge-and-obs-platform.md) (mirrors platform ADR 0001).

## Product

Public project directory for Frank Schlesinger: 1990s personal-homepage look, table listing of apps with short descriptions and **staging** + **production** links. Rows live in `homepage/projects.json` so new projects are a data edit.

Hosts discovered from sibling Terraform (do not invent):

| App | Production | Staging |
|-----|------------|---------|
| Block Drop | `blockdrop.7oas7er.com` | `blockdrop-stg.7oas7er.com` |
| DressMe | `dressme.7oas7er.com` | `dressme-stg.7oas7er.com` |
| Netrunner | `netrunner.7oas7er.com` | `netrunner-stg.7oas7er.com` |

## What this repo owns

| Path | Role |
|------|------|
| `homepage/` | Static listing site |
| `infra/terraform/aws/` | S3, CloudFront, `/api/health` Lambda, OIDC deploy/plan |
| `infra/terraform/cloudflare/` | **DNS only** for `www.7oas7er.com` / `www-stg.7oas7er.com` |
| `infra/terraform/grafana/` | Folder, **prod+stg** dashboards, synthetics, CloudWatch scrape, GitHub DS `github-homepage` |
| `.github/workflows/` | Tests, deploy, terraform plan (never apply) |

## What platform owns (do not recreate here)

- Zone rulesets: origin-verify, cache, redirects, SSL for Homepage hosts in `shared-edge`
- Shared Infinity DS `infinity-cloudflare` and GitHub catalog **plugin**
- Apex redirect: `7oas7er.com` → `https://www.7oas7er.com` (Homepage). `www` is **not** redirected to Block Drop after cutover ([ADR 0008](adr/0008-www-hosts-and-apex-redirect.md)).

## Traffic path

Browser → Cloudflare (custom domain) → inject `X-Origin-Verify` → CloudFront → S3 (and `/api/health` → Lambda). Direct CloudFront URLs return 403.

## Operator notes

First apply + www cutover are done (see [`scaffold-follow-ups.md`](scaffold-follow-ups.md)). Further changes: small PRs → `staging`, promote `staging` → `main` when asked; platform redirect/origin-verify edits only with Frank’s OK.
