# website

Personal technical blog built with [Astro](https://astro.build) and deployed to
[GitHub Pages](https://pages.github.com) via GitHub Actions.

## Repository layout

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions workflow (build + deploy)
├── site/                     ← Astro project (config, layouts, pages)
│   ├── astro.config.mjs
│   ├── package.json
│   ├── src/
│   │   ├── content/
│   │   │   └── blog/         ← ✏️  YOUR POSTS GO HERE (.md files)
│   │   ├── content.config.ts ← content schema (don't edit unless adding fields)
│   │   ├── layouts/          ← shared HTML shells (don't edit for new posts)
│   │   └── pages/
│   │       └── blog/         ← routing code (don't edit for new posts)
│   └── public/
└── README.md
```

### `content/blog/` vs `pages/blog/` — what's the difference?

These two folders sound similar but serve completely different purposes:

| Folder | What it is | Who edits it |
|---|---|---|
| `site/src/content/blog/` | Your **Markdown posts** — the actual text, code, and images that make up each article | **You**, every time you write a new post |
| `site/src/pages/blog/` | Astro **routing code** — the templates that read your Markdown files and turn them into HTML pages | Only when changing how posts are displayed (layout, metadata shown, etc.) |

**In practice:**
- To write a new post → add a `.md` file to `site/src/content/blog/`. Done.
- `site/src/pages/blog/` contains two files you can mostly ignore:
  - `index.astro` — renders the `/blog` listing page (reads all posts from `content/blog/`)
  - `[...slug].astro` — renders each individual post page (e.g. `/blog/my-post`)

## Writing a post

1. Create a new `.md` file inside `site/src/content/blog/`, e.g. `my-first-post.md`.
2. Add frontmatter at the top:

   ```markdown
   ---
   title: "My First Post"
   description: "A short summary shown in the post list."
   pubDate: 2026-03-15
   tags: ["engineering", "notes"]   # optional
   ---

   Your post content here.
   ```

3. Push to `main` — the Actions workflow will build and deploy automatically.

The post will be available at `/blog/my-first-post`.

## Local development

### Prerequisites

- **Node.js 18 or later** — [download from nodejs.org](https://nodejs.org/).  
  Verify you have it: `node --version` (should print `v18.x.x` or higher).
- **npm** — bundled with Node, no separate install needed.

### First-time setup

```bash
# 1. Clone the repo (skip if you already have it)
git clone https://github.com/BudgetSanta/website.git
cd website

# 2. Install dependencies
cd site
npm install
```

### Day-to-day: hot-reload dev server

```bash
cd site
npm run dev
```

- Opens a dev server at **http://localhost:4321**.
- Every time you save a file — Markdown post, layout, style — the browser
  refreshes automatically.
- This is what you'll use 99% of the time while writing or editing.

### Before you merge: preview the production build

The dev server skips some optimisations. To see exactly what GitHub Pages will
serve, do a full production build and preview it locally:

```bash
cd site
npm run build      # compiles everything to site/dist/
npm run preview    # serves site/dist/ at http://localhost:4321
```

Open **http://localhost:4321** and click around — if it looks right here, it
will look right after merging and deploying.

> **Tip:** `npm run build` will also catch any type errors or broken imports
> that the dev server sometimes overlooks, so it's a good final sanity-check
> before opening a PR.

## Deployment

Pushes to `main` trigger the `deploy.yml` workflow, which:

1. Runs `npm run build` inside `site/`.
2. Uploads `site/dist/` as a GitHub Pages artifact.
3. Deploys it to GitHub Pages.

### First-time setup

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or trigger the workflow manually) — that's it.

### Custom domain

To use a custom domain (e.g. `example.com`):

1. In **Settings → Pages**, enter your domain in the **Custom domain** field and
   save. GitHub will automatically commit a `CNAME` file to the repository root
   (or you can add it to `site/public/CNAME` so it ends up in the build output).
2. At your DNS provider, add:
   - An `A` record pointing `@` (or your apex domain) to GitHub's Pages IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (Or a `CNAME` record for a subdomain pointing to `<username>.github.io`)
3. The workflow automatically detects the correct `base` path via
   `actions/configure-pages`, so no changes to `astro.config.mjs` are needed.

> **CNAME file location:** GitHub Pages expects the `CNAME` file in the root of
> the published output. The easiest way is to create `site/public/CNAME` with
> your domain on a single line (no `https://`), for example:
>
> ```
> example.com
> ```
>
> Astro will copy everything in `public/` to `dist/` at build time.
