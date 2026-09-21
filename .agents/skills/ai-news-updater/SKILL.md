---
name: ai-news-updater
description: >-
  Update the hand-curated "最近 AI 模型和产品动态" news list on justin3go.com:
  read the current data file, research the last N days of AI model releases /
  product updates / industry moves via web search, propose entries as a table
  for confirmation, then prepend them to docs/.vitepress/theme/news.ts.
  Triggers: 更新AI动态, AI动态更新, 更新新闻, 收录AI新闻, AI动态, 收录几条AI新闻,
  "update AI news", "add news items". Writing full articles belongs to blog-writer;
  editing existing posts belongs to blog-post-processor. Publishing (commit + push
  to release) happens only on explicit confirmation.
---

# AI News Updater

Keep the site's AI-radar module fresh: `docs/.vitepress/theme/news.ts` feeds the homepage section (`ProfileNews.vue`), the `/news` page, and `/en/news`. Pipeline: read current state → web research → propose a table (hard gate) → prepend on confirmation → self-check → report. Publishing is push-to-`release` and only on explicit user confirmation.

## When This Skill Activates

| Signal | Action |
|---|---|
| 更新AI动态 / 收录AI新闻 / update AI news | Full workflow below |
| User wants a full article about one news item | Stop — that is `blog-writer` |
| User asks to fix an entry's typo/link or delete one | Direct edit of `news.ts`, no research pass, confirm the change first |
| User is just chatting about AI news | Do not fire |

## Step 1: Read the Current State

Read `docs/.vitepress/theme/news.ts`. Note:

- entry count (cap: **50**; trim oldest when exceeded)
- newest date (research window starts after it)
- existing URLs and titles — this is the dedup set; the same event may surface under different headlines
- the schema comment: entries are newest-first (date descending), fields in the exact order `date / title{zh,en} / comment{zh,en} / url / source / kind`

## Step 2: Research

Search the last 7 days by default (or the window the user names) across three buckets — model releases (`kind: 'model'`), product launches/updates (`kind: 'product'`), notable industry moves (`kind: 'industry'`).

Rules:

- **Primary sources only** for `url`: official blogs, official help/docs pages, official X accounts, GitHub/Hugging Face release pages. Aggregator coverage (fav0, TechCrunch, …) is fine for *discovery* but never as the stored link; if no primary link is findable, mark the entry 待补主源 in the table instead of silently linking an aggregator.
- Pick **3–8 significant items** with a kind mix (not all models, not all one company).
- `date` = the announcement date stated by the primary source (`YYYY-MM-DD`), never the discovery date, never invented. If the source shows no date, mark 待核日期.
- If WebSearch is unavailable (quota), fall back to WebFetch on known hubs (anthropic.com/news, blog.google, fav0.com) and say which sources were used.

## Step 3: Propose — Hard Gate

Present this table in Chinese in the chat, then **STOP** — no file edit before the user confirms:

```
| # | 日期 | 类型 | 标题 zh / en | 来源 | 链接 | 一句话点评 zh | comment en |
```

Show full URLs (they are the thing being approved). Flag any 待补主源 / 待核日期 inline. On revision requests, re-present the table; the gate re-arms every time.

## Step 4: Edit on Confirmation

Prepend the confirmed entries to the `news` array in `docs/.vitepress/theme/news.ts`:

- keep the file strictly date-descending; splice new entries into their correct positions
- keep field order and quoting style identical to existing entries (single quotes, escaped where needed)
- if the total would exceed 50, drop the oldest entries and **report exactly what was trimmed** — never silently
- do not touch anything else in the file (no reformatting of existing entries)

Comment-writing guidance (both locales):

- zh first, one sentence, ≤ ~40 chars, specific over clever — a number, a constraint, or a real tradeoff beats an adjective
- opinions are welcome, facts must be verifiable from the linked source; never fabricate numbers/quotes
- en is a natural re-rendering in sam's voice, not a literal translation

## Step 5: Self-Check

Verify against `tests/news-list.test.mjs` expectations (they run in `npm test`):

- every new `date` matches `^\d{4}-\d{2}-\d{2}$` and is not in the future
- every `url` is `https://` and not already present in the file
- `title.zh/en` and `comment.zh/en` all non-empty
- `kind` ∈ model / product / industry
- array order remains date-descending

## Step 6: Report and Hand Off

Report: entries added (count + dates), anything trimmed, anything left 待补. Remind the user:

- homepage, `/news`, `/en/news` pick the file up automatically — no registration anywhere
- `npm test` covers data sanity if they want a quick check
- 发布 = commit (`docs: update AI news YYYY-MM-DD`) + push to `release`; **never push without explicit confirmation**

## Mistake → Fix

| Mistake | Fix |
|---|---|
| Edited `news.ts` before 确认 | Revert via git; the gate is non-negotiable |
| Date invented or taken from an aggregator's publish time | Use the primary source's announcement date or mark 待核日期 and ask |
| Aggregator link stored as `url` | Replace with the primary source link before commit |
| Broke date-descending order or field order | Restore; `sortNewsDesc` guards rendering but the file itself stays sorted |
| Exceeded the 50 cap silently | Trim oldest and report what was trimmed |
| Pushed without explicit confirmation | — (must not happen; publishing is user-only) |
| Left en fields empty "for now" | Both locales ship together or the entry doesn't ship |
