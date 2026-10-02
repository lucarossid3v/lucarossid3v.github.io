# lucarossi.d3v

Tech and programming blog by Luca Rossi, built with [Astro](https://astro.build) as a fully static site.

## Requirements

- Node.js >= 22.12
- npm

## Commands

| Command                  | What it does                                 |
| :----------------------- | :------------------------------------------- |
| `npm install`            | Install dependencies                         |
| `npm run dev`            | Dev server on `http://localhost:4321`        |
| `npm run build`          | Build the static site into `dist/`           |
| `npm run preview`        | Preview the production build                 |
| `npm run qa`             | Type check (`astro check`) and build         |
| `npm run lint`           | ESLint                                       |
| `npm run format`         | Prettier                                     |
| `npm run audit:wcag`     | Accessibility audit of `dist/` (build first) |
| `npm run audit:security` | Security audit of `src/` and `dist/`         |
| `npm run audit:google`   | SEO audit of `dist/`                         |

## Writing posts

Each post is a folder with an `index.md` and its images:

```text
src/content/blog/my-post/
├── index.md
└── diagram.png
```

Frontmatter:

```yaml
---
title: 'My post'
description: 'One-sentence summary used for SEO and previews.'
pubDate: 2026-10-02
tags: ['programming']
draft: false # true hides the post everywhere
---
```

The folder name becomes the URL (`/blog/my-post/`). `src/content/` can also be opened as an Obsidian vault (see `src/content/_GUIDE.md`).

## Configuration

Site identity, navigation, social links and feature flags live in `src/config/site.ts`.

`SITE_URL` (see `.env.example`) sets the canonical domain used for the sitemap, RSS and SEO tags. Until the final domain is chosen it defaults to a GitHub Pages placeholder. If the site is served from a sub-path (`https://<user>.github.io/<repo>/`), also set `base` in `astro.config.mjs`.

## License

MIT. See [LICENSE](LICENSE).
