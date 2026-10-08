---
title: 'Obsidian + Claude Code: A Second-Brain Setup That Persists'
description: 'Set up an Obsidian vault for Claude Code: CLAUDE.md, rules, skills and hooks, plus the limits and risks of letting an agent write to your notes.'
pubDate: 2026-10-08
tags: ['ai', 'claude-code', 'obsidian', 'productivity']
draft: false
---

Claude Code is very good at working in files, and an Obsidian vault is just a folder of Markdown files. That makes the pairing obvious. It also makes it easy to get wrong, because every Claude Code session starts empty, and most guides stop at "put a `CLAUDE.md` in the vault".

This post goes one step further. It covers where to start Claude Code, what to put in the instructions file, how to split rules by path, when to use skills, and why hooks, not instructions, are what you rely on when something must never happen. The examples come from the setup of this blog's own `src/content` folder, which is an Obsidian vault with a Claude Code layer on top. Version checked: Claude Code 2.1.294, against the official docs ([memory](https://code.claude.com/docs/en/memory), [hooks](https://code.claude.com/docs/en/hooks-guide) and [skills](https://code.claude.com/docs/en/skills)) on 2026-10-08. Claude Code changes fast, so re-check version-specific details before relying on them.

> **Key Takeaways**
>
> - Each Claude Code session begins with a fresh context window. Your vault, and the instructions file inside it, carry the memory.
> - Start `claude` from the vault root. Keep `CLAUDE.md` short (the docs target under 200 lines) and move specifics into path-scoped rules.
> - `CLAUDE.md` is context, not enforcement. To block an action regardless of what the model decides, use a `PreToolUse` hook.
> - Skills turn repeated jobs (sorting an inbox, a weekly review) into one slash command.
> - Treat write access like any other change: Git history first, diffs reviewed, secrets kept out.

## Why a vault fits Claude Code

Claude Code reads and edits plain files with its own tools, so basic use needs no plugin and no server. A vault of Markdown notes is already in the format it handles best.

What it does not have is memory. The [memory documentation](https://code.claude.com/docs/en/memory) states it directly: each session begins with a fresh context window, and two mechanisms carry knowledge across sessions. `CLAUDE.md` files hold instructions you write. Auto memory holds notes Claude writes itself. I use only the first: for a knowledge base I prefer every instruction to be something I wrote and can review in a diff.

A vault adds the part neither mechanism covers: long-lived, human-curated knowledge that you can open in an editor, search, link and version. The instructions file tells Claude how that knowledge is organized. The notes themselves are the memory.

## Open the vault as the working directory

The simplest setup is to run `claude` from the vault root:

```bash
cd ~/vaults/notes
claude
```

Claude Code then loads the `CLAUDE.md` in that directory, and the rules under `.claude/`, at the start of the session.

If the vault lives outside the project you are working in, `--add-dir` gives Claude access to it. There is a catch: by default, `CLAUDE.md` files from added directories are not loaded ([docs](https://code.claude.com/docs/en/memory)). To load them, set an environment variable:

```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ~/vaults/notes
```

Without it, Claude can read the notes but does not see your conventions, which is a likely cause when instructions seem ignored.

Two Obsidian-specific folders deserve a mention in the instructions. `.obsidian/` holds your plugin and workspace settings, and the editor rewrites parts of it constantly. Tell Claude not to touch it. The same goes for templates: they are inputs, not notes.

## Write a short CLAUDE.md for the vault

The [docs](https://code.claude.com/docs/en/memory#claude-md-files) give a clear size target: under 200 lines per file, because longer files consume more context and reduce adherence. For a vault, that is plenty. What the file needs to answer is what a new collaborator would ask on day one.

```markdown
# Vault guide

Personal knowledge base. I write in Markdown, Claude helps with
organizing and drafting. Notes are in English unless stated.

## Layout

- `inbox/`: raw captures. Anything goes here. Process, don't keep.
- `notes/`: atomic notes, one idea each, linked to related notes.
- `projects/`: one folder per active project, with an `index.md`.
- `archive/`: finished or dead material. Read-only.
- `templates/`: note templates. Do not edit.

## Conventions

- Filenames: kebab-case, no dates in names.
- Every note has frontmatter: `title`, `created` (YYYY-MM-DD), `tags`.
- Link with relative Markdown links, not wikilinks.
- One idea per note. If a note needs two headings of equal weight, split it.

## Rules

- Never edit `archive/` or `templates/`.
- Never touch `.obsidian/`.
- New notes go to `inbox/` first, with `status: draft` in frontmatter.
- When unsure where something belongs, ask instead of guessing.
```

Three habits keep this useful. First, say what is read-only, not just what is allowed. Second, write conventions you actually follow, because Claude will apply them literally. Third, keep it boring. The more specific and concise the instructions, the more consistently they are followed.

### Move specifics into path-scoped rules

When the file grows, do not just keep appending. Rules can live in `.claude/rules/` as separate Markdown files, and a `paths` field in the frontmatter makes a rule load only when Claude reads or edits matching files ([path-specific rules](https://code.claude.com/docs/en/memory#path-specific-rules)). An example:

```markdown
---
paths:
  - 'blog/**'
---

# Blog drafts

- Everything created here gets `draft: true`.
- Published posts change only on explicit request. Show the diff.
```

Imports with `@path` are the other option, and they help with organization. But the docs are explicit that imported files still load at launch, so imports do not reduce context cost. Path-scoped rules do, because they load on demand. Imports can nest, up to four hops.

> [!TIP]
> My own rule of thumb: if your `CLAUDE.md` passes about 150 lines, that is the signal to extract a path-scoped rule rather than add a section.

## Folder structure Claude can navigate

You do not need a particular methodology. PARA, Zettelkasten-style flat notes or an inbox/process/output split all work, as long as three things hold: folder names say what is inside, every note has predictable frontmatter, and each area has an index note that says what it contains.

This tree is an illustration of the layer, simplified from this blog's setup (there, the vault is the `src/content` folder inside the repo, so `CLAUDE.md` and `.claude/` sit at the repo root, and the repo has a couple more skills):

```text
vault/
├── CLAUDE.md                  # short guide, loaded every session
├── .claude/
│   ├── settings.json          # hooks
│   ├── rules/
│   │   └── content-vault.md   # path-scoped rule
│   ├── hooks/
│   │   ├── guard-vault.mjs    # blocks writes to protected files
│   │   └── check-frontmatter.mjs
│   └── skills/
│       ├── inbox/SKILL.md
│       ├── brief-to-draft/SKILL.md
│       └── weekly-review/SKILL.md
├── _inbox/                    # private captures
├── _notes/                    # private atomic notes
├── _briefs/                   # private post briefs
└── blog/                      # published posts
```

One design choice worth copying: private working folders get an underscore prefix and are ignored by Git, so Claude can read and organize them, but nothing in them is published by accident. The published folders are the only ones the site reads.

## Skills and hooks: repeatable jobs and hard guardrails

These two features solve different problems, and mixing them up is an easy mistake.

### Skills for jobs you repeat

A [skill](https://code.claude.com/docs/en/skills) is a directory with a `SKILL.md` file under `.claude/skills/<name>/` (or `~/.claude/skills/` for all your projects). Its frontmatter has a `description`, and the body is the instructions Claude follows when you run `/<name>`. The `$ARGUMENTS` placeholder receives whatever you type after the name. Setting `disable-model-invocation: true` stops Claude from loading the skill by itself, so it only runs when you call it.

This is a lightly trimmed version of the skill this blog uses to sort raw captures:

```markdown
---
name: inbox
description: Sort the raw notes in src/content/_inbox/ into notes, brief ideas or discards. Use as /inbox.
disable-model-invocation: true
---

Process `src/content/_inbox/`.

1. List the files. If empty, say so and stop.
2. For each file, propose one of: a note in `src/content/_notes/`, a brief idea, or discard.
3. Show the proposals as a table and wait for confirmation. Apply only what the user confirms.
4. Never delete or move a file without confirmation.
```

The other two skills in the setup follow the same pattern. `/brief-to-draft` turns a brief into a draft post bundle with `draft: true`. `/weekly-review` is read-only: it lists stalled drafts, briefs without a post and unsorted inbox items. Note the confirmation step in `/inbox`. A skill is still just instructions, so anything destructive should ask first.

### Hooks for guarantees

The distinction that matters: the [memory docs](https://code.claude.com/docs/en/memory) describe `CLAUDE.md` and auto memory as context, "not enforced configuration". To block an action regardless of what Claude decides, they point to a `PreToolUse` hook. [Hooks](https://code.claude.com/docs/en/hooks-guide) are shell commands that run at fixed points in Claude Code's lifecycle, which gives deterministic control: certain things always happen rather than relying on the model to choose them.

A hook receives the event as JSON on stdin. If it exits with code 2, Claude Code blocks the action, using your stderr text as the blocking message (see the [hooks reference](https://code.claude.com/docs/en/hooks)). This is the real guard from this blog, which protects the Obsidian settings and a few vault-internal files:

```js
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const rel = relative(root, resolve(root, file)).split('\\').join('/');
const protectedPaths = [
  'src/content/.obsidian/',
  'src/content/_bases/',
  'src/content/_GUIDE.md',
];

if (protectedPaths.some((p) => rel === p || rel.startsWith(p))) {
  console.error(
    `Blocked: ${rel} is a protected vault file. Ask the user to edit it by hand in Obsidian.`,
  );
  process.exit(2);
}
```

It is wired up in `.claude/settings.json` with a matcher for the file-writing tools:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/guard-vault.mjs\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

Know what this covers. The hook's matcher lists only file-writing tools, so it does not stop a shell command that writes to the same path. I note that limit in the vault's own rules file ("the hook does not cover Bash"). If you need that guarantee, add a second hook for the shell tool or restrict permissions. A guard is only as strong as the tools it watches.

The same settings file also has a `PostToolUse` hook that checks frontmatter after every edit to a post, and fails with exit code 2 if `title`, `description` or `pubDate` is missing or malformed. That is the other good use of hooks: cheap checks that you never want to forget.

## Keep it portable: AGENTS.md and MCP

A vault outlives any one tool. If you also use other coding assistants, write the conventions once in `AGENTS.md` and let each tool read it.

Claude Code's behavior here has an easily missed detail. By default, it reads `AGENTS.md` only when there is no `CLAUDE.md` in the working directory or above it, and reading it directly needs Claude Code v2.1.277 or later. The straightforward pattern, and the one the docs recommend when you also have a `CLAUDE.md`, is to import it:

```markdown
@AGENTS.md

## Claude Code

- Claude-specific notes go here.
```

That keeps one source of truth, and Claude Code stops being a lock-in.

For the integration question, the honest answer is that for most vaults Claude Code needs nothing extra. Direct file access covers reading, searching and editing. An MCP server becomes worth it when you want something Claude Code does not have on its own, such as Obsidian-aware queries or talking to a running Obsidian instance. Add one when you hit that limit, not before.

## Which mechanism for what

| Mechanism                         | Loads                        | Enforced? | Use it for                         |
| --------------------------------- | ---------------------------- | --------- | ---------------------------------- |
| `CLAUDE.md`                       | Every session                | No        | Layout, conventions, what to avoid |
| Path-scoped rule                  | When matching files are used | No        | Detail for one folder or file type |
| `@path` import                    | Every session, at launch     | No        | Organizing a long file             |
| Skill                             | When you run `/<name>`       | No        | Repeatable multi-step jobs         |
| `PreToolUse` / `PostToolUse` hook | On every matching tool call  | Yes       | Blocking writes, running checks    |

## Risks and limits

Letting an agent write to your notes is a trade-off. Four things to plan for.

**Changes to your notes.** Put the vault under Git before the first write, commit often, and read the diff. Without history, a bad bulk edit is hard to undo. With it, a bad edit costs a `git restore`. If you want a deeper checklist for reviewing what an agent produces, I wrote one in [Reviewing and Securing AI-Generated Code](/blog/reviewing-securing-ai-generated-code-checklist/).

**Privacy.** Claude Code sends your prompts and the model's outputs to the model provider over the network. Any file contents Claude has read into the conversation travel with them. Retention and training rules depend on your account type, as Anthropic's [data usage page](https://code.claude.com/docs/en/data-usage) explains. Keep secrets, credentials and client data out of the vault, or in a folder Claude is told, and technically prevented, from reading.

**Prompt injection.** Web clippings and imported documents are untrusted text. [Indirect prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) is when instructions hidden in external content change the model's behavior, so a note that contains instructions can be read as instructions. Keep imported material in a separate folder, review it before it enters the main notes, and do not give the session more permissions than the task needs. The wider open-source community is learning the same lesson about autonomous agents, as I describe in [Open Source in the Vibe Coding Era](/blog/open-source-vibe-coding-era/).

**Context cost.** A big vault does not fit in one context window, and a long `CLAUDE.md` makes adherence worse. Rely on folder names and index notes so Claude opens a few files rather than scanning everything. This is the same discipline I argue for in [Vibe Coding vs. AI-Assisted Engineering](/blog/vibe-coding-vs-ai-assisted-engineering/): the tool is fast, and the judgment stays with you.

## FAQ

### Does Claude Code remember my vault between sessions?

No. Each session starts with a fresh context window. What persists is the files: your notes, your `CLAUDE.md` and rules, and, if you enable it, auto memory. The instructions file is what lets a new session pick up the conventions quickly.

### Should I use CLAUDE.md or auto memory?

They are complementary. `CLAUDE.md` is what you write and review; auto memory is what Claude writes about your corrections and preferences. I use only `CLAUDE.md`, because for a knowledge base I want every instruction to be something I can read and diff.

### Do I need the Obsidian plugin or an MCP server?

Not to start. Claude Code edits the Markdown files directly.

## Conclusion

The setup is small. A short `CLAUDE.md` describes the vault. Path-scoped rules hold the details. Skills turn repeated jobs into commands. Hooks enforce what must never happen. Git is the safety net under all of it.

Start in read-only mode: ask Claude to explore and summarize, and see whether it understands the layout. Once it does, allow writes to a single folder, such as `inbox/`, and review every diff. Widen access only when the habit is working.
