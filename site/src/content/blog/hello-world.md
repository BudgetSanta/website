---
title: "Hello, World — Welcome to My Blog"
description: "An introductory post demonstrating headings, lists, links, and code fences with syntax highlighting."
pubDate: 2026-03-12
tags: ["meta", "demo"]
---

Welcome! This is my first post, and it doubles as a formatting demo so you can see how everything looks.

## Headings

You can use standard Markdown headings:

### Third-level heading

#### Fourth-level heading

## Lists

**Unordered list:**

- Write posts in Markdown
- Deploy automatically with GitHub Actions
- Enjoy clean syntax highlighting

**Ordered list:**

1. Clone the repo
2. Add a new `.md` file under `site/src/content/blog/`
3. Push — done!

## Links

Check out the [Astro documentation](https://docs.astro.build) or the [GitHub Pages docs](https://docs.github.com/en/pages).

## Code fences

Inline code looks like `const greeting = "hello"`.

A TypeScript function with full syntax highlighting:

```typescript
interface Post {
  title: string;
  pubDate: Date;
  tags?: string[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const post: Post = {
  title: 'Hello, World',
  pubDate: new Date('2026-03-12'),
  tags: ['meta', 'demo'],
};

console.log(formatDate(post.pubDate)); // March 12, 2026
```

A shell snippet:

```bash
cd site
npm install
npm run dev
```

And a JSON config snippet:

```json
{
  "name": "my-blog",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

## Blockquotes

> "Make it work, make it right, make it fast."
> — Kent Beck

## Horizontal rule

---

That's it for the demo. More posts coming soon!
