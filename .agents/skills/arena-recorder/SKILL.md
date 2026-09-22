---
name: arena-recorder
description: >-
  Record a new round in the model arena (模型竞技场) on justin3go.com: pick a prompt
  from the fixed suite, collect real answers — live in-session (codex bridge /
  the session model) and/or user-pasted verbatim outputs — present everything for
  confirmation, then prepend the round to docs/.vitepress/theme/arena.ts.
  Triggers: 记录竞技场, 竞技场新一轮, 跑一轮竞技场, 收录模型对答, 竞技场加一轮,
  "add arena round", "run arena round". Updating the AI news list belongs to
  ai-news-updater; writing an article about a round belongs to blog-writer.
  Answers are verbatim — never paraphrased, never written on a model's behalf.
  Publishing (commit + push to release) happens only on explicit confirmation.
---

# Arena Recorder

Add rounds to the site's model arena: `docs/.vitepress/theme/arena.ts` holds the fixed prompt suite (`arenaPrompts`) and the rounds (`arenaRounds`, newest-first); `/arena` and `/en/arena` render them via `ArenaBoard.vue`. Pipeline: read state → pick/add prompt → collect answers → preview gate → prepend → self-check → report.

## When This Skill Activates

| Signal | Action |
|---|---|
| 记录竞技场 / 跑一轮竞技场 / add arena round | Full workflow below |
| User pastes model outputs and wants them recorded | Collect step, then gate |
| User wants to add/change a suite prompt | Suite gate (Step 2) — separate hard gate |
| User wants the AI news list updated | Stop — that is `ai-news-updater` |
| User wants an article about a round | Stop — that is `blog-writer` |
| User is just chatting about model comparisons | Do not fire |

## Step 1: Read the Current State

Read `docs/.vitepress/theme/arena.ts`. Note: existing prompt ids, newest round date, and the model+date pairs already recorded per prompt (dedup set).

## Step 2: Select or Add the Prompt

Default: pick an existing prompt by `id` — say which one and why briefly.

Adding or editing a suite prompt is a **separate hard gate**: propose `id / category / title{zh,en} / prompt / note{zh,en}` as a table and STOP for confirmation. Rules: ids are stable slugs; once any round references a prompt, its `id` and `prompt` text are immutable (the suite is the standard — changing it mid-stream breaks comparability). New prompts append to the suite; the test file asserts ids unique and all 8 categories present exactly once — adding a 9th prompt means updating that test expectation in the same change.

## Step 3: Collect Answers — Honesty Rules

- Copy the prompt text **byte-identically from `arena.ts`** — never retype it. Live channels and user alike must receive the same bytes.
- **Live channels**: send the prompt via `mcp__codex__codex_query` (sandbox read-only) for GPT-family answers; the session model answers the same text directly in-chat. Label `model` exactly as the channel truthfully reports (ask the bridge its model id if unknown). **Never assume the session model is "Claude"** — determine what it actually is; if undeterminable, ask the user rather than guess.
- **User-pasted**: accept verbatim only. Ask for the exact model version and the date the output was produced. Store with `source: 'user'`. The only permissible cleanup is trimming trailing whitespace — no reflowing, no typo fixes, no truncation.
- **Never invent, paraphrase, or "reconstruct" an answer for a model that wasn't run.** A model absent from the round is simply absent — the schema has no empty slots.

## Step 4: Preview — Hard Gate

Present in chat, then **STOP** — no file edit before confirmation:

- round date + promptId
- for each answer: model, date, source label, and the **full verbatim text**
- draft bilingual verdict (`sam 的点评` — opinion welcome, no scores)

The full texts are the thing being approved; never show summaries instead. The gate re-arms on every revision.

## Step 5: Edit on Confirmation

Prepend the round to `arenaRounds` keeping strict date-descending order and the exact field order/quoting style of existing entries. Touch nothing else in the file.

## Step 6: Self-Check

Mirror of `tests/arena-list.test.mjs` assertions: `promptId` exists in the suite; no duplicate `model+date` within the round; every answer non-empty; `source` ∈ live/user; all dates match `^\d{4}-\d{2}-\d{2}$` and are not future; `verdict.zh/en` both non-empty; array stays date-descending. Then run `npm test`.

## Step 7: Report and Publish

Report: models recorded + their sources, round date, prompt used. Remind: `/arena` and `/en/arena` pick the file up automatically. Commit convention: `feat: add arena round YYYY-MM-DD <promptId>`. **Never push without explicit user confirmation.**

## Mistake → Fix

| Mistake | Fix |
|---|---|
| Paraphrased or invented an answer | Revert via git; rerun the real channel or drop the model from the round |
| Mislabeled a model or source | Fix before commit — labels are the feature's integrity |
| Edited `arena.ts` before the gate | Revert via git; the gate is non-negotiable |
| Retyped the prompt instead of copying bytes | Replace with the exact text from `arena.ts`; rerun the affected answers |
| Changed a published prompt's id/text | Revert — immutability rule; add a new prompt instead |
| Left one locale of the verdict empty | Both ship together or the round doesn't ship |
| Pushed without explicit confirmation | — (must not happen; publishing is user-only) |
