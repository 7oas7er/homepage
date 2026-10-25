# Health Lambda (scaffold)

Runtime: Node.js 22 (`nodejs22.x`), arm64. Handler: `health.handler`.

Template scaffold for synthetics / smoke checks. The listing site itself is static.

## API

| Method | Path | Result |
|--------|------|--------|
| `GET` / `HEAD` | `/api/health` | `{ ok: true, service: "homepage", path: "/api/health" }` |

## Setup (before `terraform plan` / `apply`)

```bash
cd infra/lambda
npm ci --omit=dev
```

`node_modules/` is gitignored. Commit `package.json` and `package-lock.json` when changing dependencies.

## Tests

```bash
npm test
```
