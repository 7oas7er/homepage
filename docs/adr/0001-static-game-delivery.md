# ADR 0001 — Frontend delivery

- **Status:** accepted (adapted from Block Drop template)
- **Date:** 2026-10-26

## Context

Block Drop ships a zero-build puzzle. Homepage is a project listing, not a wardrobe SPA.

## Decision

Ship the listing as static HTML/CSS/JS under `homepage/` with **no bundler**. Project rows live in `projects.json`. Keep deploy as static assets to S3/CloudFront.

## Consequences

Agents should not introduce a SPA framework or bundler unless Frank asks. Adding a project is a JSON edit + deploy.
