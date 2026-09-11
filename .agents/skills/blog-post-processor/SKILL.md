---
name: blog-post-processor
description: "Manage existing blog posts for the justin3go.com VitePress blog: query, edit, rename, add AI summary, translate, and delete. Full pipeline for a new Chinese .md post: rename to English slug + frontmatter + summary + translate. Triggers on 'process this post', 'translate this article', 'add AI summary', 'rename this blog post', or Chinese 查/改/删 requests: 找文章, 查一下我写过, 我有哪些关于…的文章, 修改文章, 改一下那篇, 删掉文章, 删除这篇文章. Creating a new post from an idea belongs to blog-writer."
---

# Blog Post Processor

Everything about **existing** posts on this VitePress blog: query (查) → edit (改) → rename → summarize → translate → delete (删). Creating a new post from an idea is `blog-writer`'s job.

## When This Skill Activates

| Signal | Action |
|--------|--------|
| User provides a Chinese `.md` post | Full pipeline: rename + frontmatter + summary + translate |
| Post was created by `blog-writer` (slug/frontmatter/summary already done) | Translation only (Steps 6-7) |
| User asks to find / list / search posts (查一下, 找文章, 我写过哪些…) | Query flow below |
| User asks to edit / revise an existing post (修改文章, 改一下那篇…) | Update flow below |
| User asks to delete a post (删掉, 删除这篇文章) | Delete flow below — confirm first |
| User asks to translate a post | Translation only (with summary if missing) |
| User asks to add AI summary | Add summary to existing post(s) |
| User asks to rename a post | Rename with English slug |

## Project Structure Context

This blog uses VitePress with i18n (Chinese + English):

```
docs/
├── posts/YYYY/MM/DD-english-slug.md        ← Chinese posts
├── en/posts/YYYY/MM/DD-english-slug.md      ← English posts (same filename)
└── .vitepress/theme/
    ├── posts.data.mts                       ← Auto-discovers posts/**/*.md
    └── posts-en.data.mts                    ← Auto-discovers en/posts/**/*.md
```

Posts are auto-discovered by `createContentLoader` — no sidebar or config file references individual posts. Renaming only affects URLs (requires rebuild/deploy).

## Full Pipeline

When processing a Chinese post, follow these steps in order:

### Step 1: Analyze the Input

Read the source file. Determine:
- Does it already have frontmatter (title, date, tags)?
- Does it already have an AI summary (`<!-- DESC SEP -->` markers)?
- What is the article about? (needed for slug generation and translation)

### Step 2: Generate English Slug

Convert the Chinese title to a concise, descriptive English slug:
- Format: `DD-lowercase-words-separated-by-hyphens.md`
- The `DD` comes from the article's date (day of month)
- Keep it short but descriptive (3-7 words after the DD prefix)
- Use only lowercase letters, numbers, and hyphens

**Examples:**
- "我把 Harness Engineering 也提炼成了 SKILL" → `03-harness-engineering-distilled-into-a-skill.md`
- "GPT4o生图风格小全" → `11-gpt-4o-image-generation-guide.md`
- "HUNT0 上线了——尽早发布，尽早发现" → `01-hunt0-is-live-ship-early-hunt-early.md`

### Step 3: Add/Fix Frontmatter

Ensure the Chinese post has proper YAML frontmatter:

```yaml
---
title: <Chinese title — keep as-is from the H1 heading>
date: YYYY-MM-DD
tags:
  - Tag1
  - Tag2
---
```

Rules:
- `title` = the original Chinese title (exact match with the `# H1` heading)
- `date` = must be consistent with the file path (YYYY/MM/DD)
- `tags` = 5-8 relevant tags, can be in English or Chinese (prefer English for consistency with existing posts)

### Step 4: Add AI Summary

Insert an AI summary block between the frontmatter and the article body. This is critical — the site's excerpt system depends on the `<!-- DESC SEP -->` markers.

**Chinese post format:**

```markdown
# <Title>

> ✨文章摘要（AI生成）
>
<!-- DESC SEP -->
>
<2-4 sentence summary of the article in Chinese>
>
<!-- DESC SEP -->
```

**English post format:**

```markdown
# <Title>

> ✨Article Summary (AI Generated)
>
<!-- DESC SEP -->
>
<2-4 sentence summary of the article in English>
>
<!-- DESC SEP -->
```

The summary should:
- Capture the core topic and key takeaways
- Be 2-4 sentences, concise but informative
- Use `>` blockquote prefix for lines between the markers (matching existing post style)
- Highlight key terms in **bold** where appropriate

**Critical**: The `<!-- DESC SEP -->` markers must appear exactly twice. The site's `posts.data.mts` uses `file.content.split('<!-- DESC SEP -->')[1]` to extract the excerpt. Missing or extra markers will break excerpt display.

### Step 5: Rename the Chinese Post

Rename the file from its current name to the new slug format:

```
docs/posts/YYYY/MM/<old-name>.md → docs/posts/YYYY/MM/DD-english-slug.md
```

### Step 6: Create English Translation

Create the English version at the mirrored path:

```
docs/en/posts/YYYY/MM/DD-english-slug.md
```

Translation guidelines:
- **Frontmatter**: Translate `title` to English, keep same `date` and `tags`
- **H1 heading**: Translate to English (must match frontmatter `title`)
- **AI summary**: Write in English (not a literal translation — write naturally)
- **Body**: Translate the full article naturally, not word-by-word
- **Images**: Keep all image URLs unchanged (same `![](url)` references)
- **Code blocks**: Keep code unchanged, translate comments if present
- **Tables**: Translate cell content
- **Blockquotes**: Translate content
- Ensure the `docs/en/posts/YYYY/MM/` directory exists before writing (create if needed)

### Step 7: Verify

After all changes, verify:
1. Chinese file exists at new path with correct frontmatter and two `<!-- DESC SEP -->` markers
2. English file exists at mirrored path with correct frontmatter and two `<!-- DESC SEP -->` markers
3. Both files have matching filenames (same slug)
4. `date` in frontmatter matches the directory structure (YYYY/MM) and filename prefix (DD)
5. Old filename no longer exists (was renamed, not copied)

## Partial Operations

Not every invocation needs the full pipeline. Handle partial requests:

- **"Translate this post"** → Steps 5-6 only (add summary if missing)
- **"Add AI summary"** → Step 4 only (to one or both language versions)
- **"Rename this post"** → Steps 2, 5 only (rename both CN and EN if both exist)

## Query: Find and List Posts (查)

Posts live in `docs/posts/**/*.md` (Chinese) and `docs/en/posts/**/*.md` (English mirror). All metadata is in frontmatter (`title`, `date`, `tags`) — there are no tag pages or index files to consult.

| User wants | How |
|---|---|
| Posts mentioning a keyword | `grep -rli "<keyword>" docs/posts --include="*.md"` (body + title) |
| Posts with a tag | `grep -rl "  - <TagName>" docs/posts --include="*.md"` (two-space YAML list item) |
| Posts in a period | `ls docs/posts/YYYY/MM/` |
| A post by fuzzy title | `grep -rl "<标题片段>" docs/posts --include="*.md"`, or grep `^title:` across a month |
| Overview of one post | Read frontmatter + summary, `grep "^#" <file>` for section headings |

Report lists as a table: `date | title | path | tags`. For ambiguous requests (\"那篇讲 agent 的\"), list the candidates and ask which one before doing anything else. Zero hits → say so, suggest a looser keyword or list the recent months' titles instead.

## Update: Edit an Existing Post (改)

1. Locate the post via the Query flow; if an EN mirror exists under `docs/en/posts/`, note it.
2. Make the requested edits. Format contract must hold after editing:
   - Exactly **two** `<!-- DESC SEP -->` markers — if body content changed materially, rewrite the summary to match the new content (still 1-2 dense paragraphs with specifics).
   - Title change → update `frontmatter title` and `# H1` together, always identical.
   - Date change → the file must move to the new `docs/posts/YYYY/MM/` path (and the EN mirror too); warn the user the URL changes.
   - Slug/filename stays stable unless the user asks for a rename (rename flow above).
3. Substantially rewritten passages get the 去AI味 pass (`humanizer-zh`), with the guardrails from `blog-writer` Step 6 (frontmatter, markers, image URLs, code, sourced quotes survive; the author's bold/numbering style stays).
4. EN mirror: if it exists, apply the equivalent edits (translate naturally, not literally). If it doesn't exist, leave it absent — mention that `blog-post-processor` translation can create it on request.
5. Self-check: `grep -c '<!-- DESC SEP -->'` == 2 on every touched file; date == path; H1 == title. Remind the user changes go live on the next push to `release`.

## Delete: Remove a Post (删)

1. Locate the post(s) via the Query flow. Before deleting anything, show what will be removed and get explicit confirmation:
   - date, title, path — and whether an EN mirror exists at `docs/en/posts/YYYY/MM/<same slug>.md`
2. On confirmation: delete the Chinese file, delete the EN mirror if present, and `rmdir` the now-empty `YYYY/MM` (and `YYYY`) directories if the deletion left them empty.
3. Always warn about a **previously deployed** post: its URL will 404 after the next push, and any external links / RSS entries break. If the URL matters, suggest a redirect (Cloudflare Pages `_redirects`) instead of deletion.
4. Never batch-delete from a vague instruction (\"把那些旧文删了\") — always enumerate the exact list and get one explicit confirmation for that list.
5. Deletion only takes effect on the next push to `release` — say so; do not commit or push yourself unless the user asks.

## Edge Cases

- If the post has no date in the filename or frontmatter, ask the user
- If the `docs/en/posts/YYYY/MM/` directory doesn't exist, create it
- If an English version already exists, ask before overwriting
- If the post already has a proper English slug filename, skip rename
- If frontmatter already exists and is correct, preserve it (don't duplicate)
- If an edit touches text around `<!-- DESC SEP -->` markers, re-run `grep -c` — must stay exactly 2
- If a query hits both `docs/posts/` and `docs/en/posts/` versions of the same post, report the Chinese one and note the EN mirror exists (dedupe by filename)
- If deletion would orphan OSS images, leave them — OSS has no repo pipeline; only mention cleanup if the user asks
