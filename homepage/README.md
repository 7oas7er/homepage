# Homepage static site

1990s-style project listing for Frank Schlesinger. Deployed as static assets to S3/CloudFront.

## Content

| File | Role |
|------|------|
| `index.html` | Listing page shell |
| `projects.json` | **Add projects here** — name, description, staging + production URLs |
| `js/app.js` | Renders the table + local visitor-counter novelty |
| `css/styles.css` | Period look (tables, web-safe fonts, grid background) |
| `imprint.html` | Lightweight imprint |

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
