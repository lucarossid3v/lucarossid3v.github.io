---
name: new-post
description: Scaffold a new blog post bundle with valid frontmatter. Use as /new-post <title>.
disable-model-invocation: true
---

Create a new blog post from the title in `$ARGUMENTS`.

1. Derive a kebab-case ASCII slug from the title (lowercase, no accents/punctuation).
2. If `src/content/blog/<slug>/` already exists, stop and tell the user.
3. Create `src/content/blog/<slug>/index.md`:

```yaml
---
title: "<title>"
description: ""
pubDate: <today, YYYY-MM-DD>
tags: []
draft: true
---
```

4. Leave the body empty (or a single `## ` heading placeholder). Posts are written in English.
5. Report the created path. Don't set `image` unless a file exists under `public/`.
