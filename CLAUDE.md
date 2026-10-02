# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Astro 7 static blog based on the Minrock theme. npm, Node >=22.12. Posts are written in English. Deploy target: GitHub Pages (domain not decided yet).

## Commands

- `npm run qa` = `astro check && astro build` — the verify step. No test framework.
- `npm run lint` (ESLint + astro plugin; inherited theme issues are warnings, keep errors at 0). `npm run format` runs Prettier; a PostToolUse hook in `.claude/settings.json` already formats edited files.
- Git: git flow, branches `main` (production) / `develop`. Work on `feature/*` branches.
- `npm run audit:wcag|audit:security|audit:google` read `dist/` — run a build first. They always exit 0, so read their output instead of trusting the exit code.

## Content

- Posts are page bundles: `src/content/blog/<slug>/index.md` (slug = folder name, images beside `index.md`). Files starting with `_` are ignored.
- Schema in `src/content.config.ts`: `title`, `description`, `pubDate` (YYYY-MM-DD) required; `tags`, `draft`, `image` (path under `public/`), `audio` (defaults to true). `updatedDate` is defined but unused.
- Every page/endpoint filters `!data.draft` itself (pages, tags, RSS, `llms*.txt`, `search-index.json`). New routes must repeat the filter.
- `src/content/` is also an Obsidian vault (`.obsidian/`, `_bases/`, `_GUIDE.md`) — don't delete or reformat those.

## Placeholders to replace (change together)

The theme's demo identity (Minrock / Renato Rezende / `minrock.vercel.app`, `example.com` socials, `rnt-rez/minrock` comments repo) is still in:
`astro.config.mjs` (`site`), `src/config/site.ts`, `public/robots.txt`, `src/layouts/BaseLayout.astro` (fallbacks), `scripts/audit-google-search.mjs`. Also `SITE_URL` in `.env`. Demo posts/projects in `src/content/` are to be replaced.
For GitHub Pages, also set `base` in `astro.config.mjs` if served from `/<repo>/`.

## Gotchas

- `@astrojs/markdown-satteri` is imported in `astro.config.mjs` but not declared in `package.json` (resolved transitively via `astro`).
- Callouts (`> [!TIP]`) are handled by `src/plugins/rehype-callouts.mjs`.
- Feature flags live in `siteConfig.features` and are checked with `!== false` (missing = enabled).
- Plain CSS only (no Tailwind/MDX/React). The `@/*` alias exists but code uses relative imports.
- Style: 2-space indent, single quotes, semicolons, ESM with `node:` imports.
