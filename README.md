# website

Personal technical blog built with [Astro](https://astro.build), deployed to GitHub Pages via GitHub Actions.

## Writing a post

Add a `.md` file to `site/src/content/blog/`:

```markdown
---
title: "My Post"
description: "Short summary."
pubDate: 2026-03-15
tags: ["engineering"]   # optional
---

Content here.
```

Push to `main` — the Actions workflow builds and deploys automatically.

## Local development

```bash
cd site
npm install
npm run dev       # http://localhost:4321
```

To preview the production build before merging:

```bash
npm run build && npm run preview
```