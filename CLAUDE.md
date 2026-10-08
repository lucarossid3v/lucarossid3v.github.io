# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Astro 7 static blog. npm, Node >=22.12. Posts are written in English. Deploy target: GitHub Pages (domain not decided yet).

## Commands

- `npm run qa` = `astro check && astro build` — the verify step. No test framework.
- `npm run lint` (ESLint + astro plugin; inherited theme issues are warnings, keep errors at 0). `npm run format` runs Prettier; a PostToolUse hook in `.claude/settings.json` already formats edited files.
- Git: git flow, branches `main` (production) / `develop`. Work on `feature/*` branches.
- `npm run audit:wcag|audit:security|audit:google` read `dist/` — run a build first. They always exit 0, so read their output instead of trusting the exit code.

## Content

- Posts are page bundles: `src/content/blog/<slug>/index.md` (slug = folder name, images beside `index.md`). Files starting with `_` are ignored.
- Schema in `src/content.config.ts`: `title`, `description`, `pubDate` (YYYY-MM-DD) required; `tags`, `draft`, `image` (path under `public/`), `audio` (defaults to true). `updatedDate` is defined but unused.
- Every page/endpoint filters `!data.draft` itself (pages, tags, RSS, `llms*.txt`, `search-index.json`). New routes must repeat the filter.
- `src/content/` is also an Obsidian vault managed with Claude Code: see `.claude/rules/content-vault.md`. `_inbox/`, `_notes/`, `_briefs/` are private and gitignored.

## Site identity
Blog name `lucarossi.d3v` (author Luca Rossi, English, tech/programming). Identity, nav, socials and feature flags live in `src/config/site.ts`.
- The domain is still a **placeholder** (`https://lucarossid3v.github.io`): update `site` in `astro.config.mjs`, the Sitemap line in `public/robots.txt`, the fallback in `src/config/site.ts` and `SITE_URL`. For GitHub Pages under `/<repo>/` also set `base`.
- Projects live in `src/content/projects/<slug>/index.md` (schema in `src/content.config.ts`); `featured: true` shows them on the homepage (max 2).
- `/about` content is hardcoded in `src/pages/about.astro`; keep it professional-only (no phone, address or birth date).

## Gotchas

- `@astrojs/markdown-satteri` is imported in `astro.config.mjs` but not declared in `package.json` (resolved transitively via `astro`).
- Callouts (`> [!TIP]`) are handled by `src/plugins/rehype-callouts.mjs`.
- Feature flags live in `siteConfig.features` and are checked with `!== false` (missing = enabled).
- Plain CSS only (no Tailwind/MDX/React). The `@/*` alias exists but code uses relative imports.
- Style: 2-space indent, single quotes, semicolons, ESM with `node:` imports.
- `.claude/hooks/guard-vault.mjs` blocks Write/Edit on `src/content/.obsidian/`, `_bases/` and `_GUIDE.md`; edit those by hand in Obsidian.
