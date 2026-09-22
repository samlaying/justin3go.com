---
name: product-recorder
description: >-
  Record entries in the AI product experience log (产品体验) on justin3go.com:
  collect real hands-on notes from the user (experience) or objective product
  intros (watch), present a table for confirmation, then prepend to
  docs/.vitepress/theme/products.ts. Triggers: 记录产品体验, 产品体验, 收录产品,
  添加产品体验, 体验了新产品, "log product experience", "add a product".
  Updating AI news belongs to ai-news-updater; arena rounds belong to
  arena-recorder; writing an article belongs to blog-writer. Experience notes
  must come from the user's own words — never ghost-written. Publishing
  (commit + push to release) happens only on explicit confirmation.
---

# Product Recorder

Maintain the site's AI product experience log: `docs/.vitepress/theme/products.ts` feeds `/products` and `/en/products` (time-flow, newest first, month-grouped). Two entry kinds: `experience` (真实上手) and `watch` (客观收录待体验).

## When This Skill Activates

| Signal | Action |
|---|---|
| 记录产品体验 / 体验了新产品 / log product experience | Full workflow below, kind = experience |
| 收录产品 / 关注个产品 (objective entry, no hands-on yet) | Full workflow below, kind = watch |
| User wants the AI news list updated | Stop — `ai-news-updater` |
| User wants a model-vs-model round | Stop — `arena-recorder` |
| User wants an article about a product | Stop — `blog-writer` |

## Honesty Rules (the core of this skill)

- **experience 条目**：产品、日期、体验内容必须来自用户口述。可以追问（哪个功能？和什么比？最惊喜/最失望的点？），但**绝不代写感受**——用户的原话整理可以，无中生有不行。没有感受就先记 watch。
- **watch 条目**：note 只写客观介绍（是什么、谁家的、有什么特点），**不写任何主观感受**。可由已有知识起草；涉及最新动态时 WebFetch 官网核实，url 一律用官网/主页。
- 同一产品可以多条；`(date + product + kind)` 三元组不得重复。

## Step 1: Read the Current State

Read `docs/.vitepress/theme/products.ts`. Note: entry count, existing product names (for "已收录" checks and follow-up entries on the same product), newest date.

## Step 2: Collect

- **experience**: ask the user for — product name, when (default today), what they tried, the take (their words; batch ≤3 follow-up questions if thin). Ask for exact product version/name spelling if ambiguous.
- **watch**: product name + official url (verify it loads if unfamiliar); draft an objective one-line note zh+en from the official description or established knowledge — facts only, no adjectives of feeling.

## Step 3: Propose — Hard Gate

Present in Chinese, then **STOP** — no file edit before confirmation:

```
| 日期 | 产品 | 类别 | 类型(体验/关注) | 链接 | 备注 zh | note en |
```

The note text is the thing being approved; show it in full. Gate re-arms on every revision.

## Step 4: Edit on Confirmation

Prepend to `products` keeping strict date-descending order, exact field order and quoting style of existing entries. Category must be one of `chat/coding/image/video/audio/agent/search/other`. Touch nothing else.

## Step 5: Self-Check

Mirror of `tests/products-list.test.mjs`: dates match `^\d{4}-\d{2}-\d{2}$` and array stays descending; urls `https://`; `note.zh/en` both non-empty; kind/category enums valid; no duplicate `date+product+kind`. Then `npm test`.

## Step 6: Report and Publish

Report what was added. Remind: `/products` and `/en/products` pick the file up automatically. Commit convention: `docs: log product experience YYYY-MM-DD <product>`. **Never push without explicit user confirmation.**

## Mistake → Fix

| Mistake | Fix |
|---|---|
| Ghost-wrote an experience note | Revert via git; re-ask the user for their real take |
| watch note slipped into subjective feelings | Rewrite as objective before commit |
| Edited before the gate | Revert via git; the gate is non-negotiable |
| Wrong or dead product url | Verify against the official site before commit |
| Left one locale of the note empty | Both ship together or the entry doesn't ship |
| Pushed without explicit confirmation | — (must not happen; publishing is user-only) |
