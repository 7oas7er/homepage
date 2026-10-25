# Homepage tests

Automated checks for the static site under `../homepage/`. The site stays free of a package manager; this folder owns Node, Playwright, and a pinned `serve` for the e2e static host.

```bash
cd tests
npm ci
npm test          # unit (node:test) + e2e (Playwright)
```

CI runs `npm test` when `staging` or `main` is updated (see `.github/workflows/deploy-homepage.yml`). Deploy follows only if `homepage/**` (or the workflow file) changed — not for `tests/**`-only pushes.
