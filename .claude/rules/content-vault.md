---
paths:
  - 'src/content/**'
---

# Content vault (`src/content/`)

`src/content/` is an Obsidian vault and the Astro content root. Claude Code runs from the repo root.

## Map

- `blog/<slug>/index.md` + images beside it, and `projects/<slug>/index.md`: **published**. Astro reads only these two folders.
- `_inbox/`, `_notes/`, `_briefs/`: **private**, gitignored, ignored by Astro. Never copy their content into `blog/` or `projects/` verbatim, and never commit them.
- `_templates/`: Obsidian templates (versioned). `_bases/`, `_GUIDE.md`, `.obsidian/`: vault internals.

## Rules

- Schema: see `src/content.config.ts`; don't duplicate it. Dates are `YYYY-MM-DD`.
- Everything Claude creates under `blog/` gets `draft: true`.
- Posts with `draft: false` change only on explicit request; show the diff.
- Links: relative Markdown links only, no `[[wikilinks]]` (the site can't resolve them).
- Posts are in English. Notes and briefs are in Italian; every brief keeps an English original and an `-it` copy.
- Briefs carry frontmatter `status` (`brief`, `writing`, `published`) and `lang`.

## Protected files

`.obsidian/`, `_bases/` and `_GUIDE.md` are blocked by `.claude/hooks/guard-vault.mjs`. If a change is needed, tell the user to make it by hand in Obsidian. The hook does not cover Bash: don't use shell commands to work around it.
