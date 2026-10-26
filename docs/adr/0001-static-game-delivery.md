# ADR 0001 — Frontend delivery

- **Status:** accepted (adapted from Block Drop template)
- **Date:** 2026-10-26
- **Updated:** 2026-10-26 — HTML 3.2 / no external CSS look

## Context

Block Drop ships a zero-build puzzle. Homepage is a project listing. Frank wants an authentic mid‑90s authoring style (HTML 3.2 without CSS), not a polished modern CSS theme.

## Decision

Ship the listing as static HTML (+ tiny JS for `projects.json`) under `homepage/` with **no bundler** and **no external stylesheet**. Presentation uses HTML attributes (`body` colors, `font`, table `bgcolor`/`border`) and default browser styling. Keep deploy as static assets to S3/CloudFront.

## Consequences

Agents should not reintroduce a CSS design system, SPA framework, or bundler unless Frank asks. Adding a project remains a `projects.json` edit + deploy.
