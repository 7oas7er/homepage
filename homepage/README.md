# Homepage static site

Project listing for Frank Schlesinger in an **HTML 3.2 / no-CSS** early-web style. Deployed as static assets to S3/CloudFront.

## Content

| File | Role |
|------|------|
| `index.html` | Listing page (tables, `font`/`body` attributes, no stylesheet) |
| `projects.json` | **Add projects here** — name, description, staging + production URLs |
| `js/app.js` | Loads `projects.json` and fills the table; local visitor counter |
| `imprint.html` | Lightweight imprint (same HTML-attribute styling) |

There is intentionally **no** `css/` stylesheet — look comes from default browser rendering plus HTML 3.2-era attributes.

## Add a project

Append an object to `projects.json`:

```json
{
  "id": "my-app",
  "name": "My App",
  "description": "One short sentence.",
  "production": "https://myapp.7oas7er.com",
  "staging": "https://myapp-stg.7oas7er.com"
}
```

Use real hosts from sibling app Terraform / DNS — do not invent URLs.

## Local preview

From repo root (after `npm ci` in `tests/`):

```bash
npx --prefix tests serve homepage -l 4173
```
