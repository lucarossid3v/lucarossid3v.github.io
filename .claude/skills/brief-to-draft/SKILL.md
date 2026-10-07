---
name: brief-to-draft
description: Turn a brief in src/content/_briefs/ into a draft blog post bundle. Use as /brief-to-draft <brief file>.
disable-model-invocation: true
---

Create a draft post from the brief named in `$ARGUMENTS` (the English file, not `-it`).

1. Read `src/content/_briefs/$ARGUMENTS`. If missing, list the briefs and stop.
2. Take the slug from the brief. If `src/content/blog/<slug>/` exists, stop and tell the user.
3. Create `src/content/blog/<slug>/index.md` with `title`, `description` (the brief's meta description), `pubDate` (today, YYYY-MM-DD), `tags` from the brief and `draft: true`. Body: the TL;DR box and the H2 headings from the outline, no invented content.
4. Set `status: writing` in the brief and its `-it` copy.
5. Report the created path. Don't set `image` unless the file exists under `public/`.
