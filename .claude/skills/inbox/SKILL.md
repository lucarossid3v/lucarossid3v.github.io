---
name: inbox
description: Sort the raw notes in src/content/_inbox/ into notes, brief ideas or discards. Use as /inbox.
disable-model-invocation: true
---

Process `src/content/_inbox/`.

1. List the files. If empty, say so and stop.
2. For each file, propose one of: a note in `src/content/_notes/` (atomic, Italian, frontmatter `status: note`, `lang: it`), a brief idea (a line to add to a new brief), or discard.
3. Show the proposals as a table and wait for confirmation. Apply only what the user confirms.
4. Never delete or move a file without confirmation. Keep everything inside the private folders.
