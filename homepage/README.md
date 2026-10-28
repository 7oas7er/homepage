# Homepage static site

Project listing for Frank Schlesinger in an **HTML 3.2 / no-CSS** early-web style. Deployed as static assets to S3/CloudFront.

## Content

| File | Role |
|------|------|
| `index.html` | Listing page (headings + paragraphs, `font`/`body` attributes, no stylesheet) |
| `projects.json` | **Add projects here** — name, multi-sentence description, staging + production + repository URLs |
| `js/app.js` | Loads `projects.json` and fills stacked project blocks; local visitor counter |
| `imprint.html` | Lightweight imprint (same HTML-attribute styling) |

There is intentionally **no** `css/` stylesheet — look comes from default browser rendering plus HTML 3.2-era attributes. Projects are **not** rendered in a table: each is a headline, a short write-up, then links.

## Add a project

Append an object to `projects.json`:

```json
{
  "id": "my-app",
  "name": "My App",
  "description": "Three to five sentences describing what the app is and does.",
  "production": "https://myapp.7oas7er.com",
  "staging": "https://myapp-stg.7oas7er.com",
  "repository": "https://github.com/7oas7er/my-app"
}
```

Use real hosts from sibling app Terraform / DNS — do not invent URLs.

## Local preview

From repo root (after `npm ci` in `tests/`):

```bash
npx --prefix tests serve homepage -l 4173
```
