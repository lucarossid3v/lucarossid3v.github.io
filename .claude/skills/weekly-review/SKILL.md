---
name: weekly-review
description: Report stalled drafts, briefs without a post and posts to review. Use as /weekly-review. Read-only.
disable-model-invocation: true
---

Read-only report, change nothing.

1. Draft posts: list `src/content/blog/*/index.md` with `draft: true`, with `pubDate`.
2. Briefs: list `src/content/_briefs/*-brief.md` by `status`; flag `brief` entries with no matching folder in `src/content/blog/`.
3. Published posts older than 6 months without `updatedDate`: list them as review candidates.
4. Items in `src/content/_inbox/` still unsorted.
5. Output a short list per section and a suggested next action.
