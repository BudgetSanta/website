import { defineConfig } from 'astro/config';

// When deploying to GitHub Pages without a custom domain, set the BASE_PATH
// environment variable to your repo name (e.g. BASE_PATH=/website).
// When using a custom domain (or user/org pages), leave BASE_PATH unset (defaults to /).
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  // Replace with your actual custom domain once configured:
  site: process.env.SITE_URL ?? 'https://budgetsanta.github.io',
  base,
  markdown: {
    // Shiki syntax highlighting is enabled by default in Astro.
    // Change the theme here if desired:
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
