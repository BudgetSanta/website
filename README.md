# website

Personal technical blog built with [Astro](https://astro.build) and deployed to
[GitHub Pages](https://pages.github.com) via GitHub Actions.

## Repository layout

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml   ← GitHub Actions workflow (build + deploy)
├── site/                ← Astro project (config, layouts, pages)
│   ├── astro.config.mjs
│   ├── package.json
│   ├── src/
│   │   ├── content/
│   │   │   └── blog/    ← Markdown posts live here
│   │   ├── layouts/
│   │   └── pages/
│   └── public/
└── README.md
```

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

```bash
cd site
npm install
npm run dev        # starts the dev server at http://localhost:4321
npm run build      # builds to site/dist/
npm run preview    # previews the production build locally
```

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
