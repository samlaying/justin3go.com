---
name: blog-writer
description: >-
  Turn an idea plus source material (素材) into a finished Chinese blog post for
  justin3go.com: digest the material, present an outline for confirmation, then
  write the full article and save it in site format at docs/posts/YYYY/MM/DD-slug.md.
  Triggers when the user wants an article written from an idea or material:
  写文章, 写篇博客, 帮我成文, 把这些素材整理成文章, 根据素材写一篇, 成文,
  "write a post from this material", "turn these notes into an article".
  After writing, the article passes through the 去AI味 skill (humanizer-zh) before
  saving; publishing (commit + push to release) happens only on explicit confirmation.
  Translating or reworking an existing post belongs to blog-post-processor.
---

# Blog Writer

Turn the author's idea + source material into a finished Chinese post on justin3go.com. Pipeline: outline (explicit approval) → draft → 去AI味 pass → save → publish on confirmation. The Chinese file under `docs/posts/` is the deliverable; the English mirror belongs to `blog-post-processor`.

## When This Skill Activates

| Signal | Action |
|---|---|
| Idea and/or 素材 (pasted text, file paths, URLs), user wants an article | Full workflow below |
| An existing post needs translate / rename / summary | Stop — that is `blog-post-processor` |
| User is just discussing a topic, no article requested | Do not fire |

## Step 1: Collect the Material

Accept three intake channels and reduce all of them to one numbered inventory:

```
[1] type · source (URL or path, date) · 2-4 key points
[2] …
```

- Pasted text → index as given; local paths → Read them; URLs → WebFetch and keep provenance (the author's style cites sources — losing them cripples Step 5).
- Long sources (> ~10K chars each): scan headings first, deep-read only promising sections, record what was skipped and why. The inventory, not the raw text, is what the outline allocates.

## Step 2: Judge Readiness

| Situation | Move |
|---|---|
| Material is rich, angle is clear | Go to Step 3 |
| Thin material or ambiguous angle | Ask **one batched message of ≤ 4 questions**: intended angle/take, target reader, depth tier, which missing facts matter |
| User replies 你来定 / 都行 | Proceed with defaults; list every assumption in the outline (Step 4) |

Never invent the author's opinions, quotes, or numbers. Do web research only when the user asks for it (帮我调研…) or a gap is factual and current; mark researched facts `〔补查〕` in the outline so the user can veto them.

## Step 3: Load the Voice and the Format Contract

1. Read `references/style-guide.md` in this skill — voice, structure, evidence habits, length tiers.
2. Calibrate fresh: `ls docs/posts/<year>/<month>/` for the two newest months, Read 1–2 newest posts. The guide is stable; the samples keep it current.
3. **Single source of truth**: before writing any file, read `.agents/skills/blog-post-processor/SKILL.md` Steps 2–4 — those own the derivation rules (slug wording, title quoting, tag counts, summary-marker mechanics). This skill embeds only the output template below plus the two hard invariants; it does not restate or diverge from those rules.

## Step 4: Present the Outline — Hard Gate

Present this artifact in Chinese and then **STOP**:

```
标题候选
  A. …（推荐，理由一句话）    B. …    C. …
发布信息    2026-09-11 · 11-<proposed-slug>.md · tags: …（3-8 个）
篇幅        标准篇 6-12K 字（按素材量建议，可调）
结构
  引子：… ← 素材[1][5]
  一、…    ← 素材[2][3]
    1.1 …  ← 素材[2]
  二、…
  结论：好在哪 / 差在哪 / 谁该用
素材使用    已用 [1][2][3][5] · 弃用 [4]（一句理由）· 缺口：…
假设与待办  假设 1…；待上传图片 2 张（图 1 四层架构图、图 2 …）
```

- Do not create any file until the user confirms or edits the outline. Revisions loop back here; small tweaks (title swap, tag edit) may proceed straight to Step 5.
- Default date is today, shown in the outline — the outline is the cheap correction point. A user-named date always wins.

## Step 5: Write the Article

Follow the style guide: opinion-first 引子 with 先给一句话结论, numbered 一、二、三 sections, comparison tables, English quotes as blockquote + （中文翻译）, bold load-bearing terms, numbers with dates and sources, 结论 split 好在哪 / 差在哪 / 该不该用, and for research posts a closing italic source-note paragraph.

Write the file exactly in this shape:

```markdown
---
title: <中文标题>        # 含 ：或引号时整体加单引号
date: YYYY-MM-DD         # 不加引号，与路径一致
tags:
  - Tag1
  - Tag2                 # 3-8 个
---

# <与 frontmatter title 完全一致的标题>

> ✨文章摘要（AI生成）
>
<!-- DESC SEP -->
>
<1-2 段密集中文摘要：2-4 句，必含数字/名称/日期，关键术语加粗>
>
<!-- DESC SEP -->

## 引子：…
```

Two hard invariants (the only format rules restated here):

1. Exactly **two** `<!-- DESC SEP -->` markers with the summary between them — `posts.data.mts` extracts the excerpt via `split('<!-- DESC SEP -->')[1]`.
2. Frontmatter `date` == path `YYYY/MM/DD`.

Images: insert user-supplied URLs as-is. For images the user hasn't uploaded yet, use `![中文描述](https://oss.justin3go.com/blogs/TODO-<kebab-desc>.png)` and add each to the pending list reported in Step 9. Alt text is always a descriptive Chinese sentence. This step produces the **draft** — the next pass de-AI-flavors it.

## Step 6: Run the 去AI味 Pass

Run the draft through the author's humanizer before saving:

1. Invoke the Skill tool with `skill: "humanizer-zh"` on the draft (user-level skill, `~/.claude/skills/humanizer-zh/`). If it is not installed in the current session, Read `~/.claude/skills/humanizer-zh/SKILL.md` and apply its checklist manually.
2. Apply its 25 surface patterns + 3 deep layers (长短错配 / 叙事壳 / 结构跳跃) to the sentence-level prose, including the 摘要 — but the summary stays 1–2 dense paragraphs with specifics. Final test from the skill: 做事的人说具体的，表演的人说漂亮的.

**Guardrails — these must survive the pass untouched:**

- Frontmatter, H1, and the exactly-two `<!-- DESC SEP -->` markers
- All image URLs, code blocks, math, tables
- Sourced quotes and their （中文翻译） — the humanizer's "vague attribution" rule targets unsourced claims like 专家认为, not verified quotes with named dates

**Site style overrides generic AI-tell rules where they conflict:** bold key terms (sparingly, one per paragraph), 一、二、三 numbered sections, the 一句话 table column, and blockquoted English quotes are the author's signature style — keep them. The pass targets prose, not the skeleton.

## Step 7: Save the File

Before writing, `ls docs/posts/YYYY/MM/` — if the DD prefix + slug wording collides with an existing post, reword the slug (never silently change the date). If an existing post already covers the same topic, surface it and ask: new article or update the old one?

One Write of the complete file. No registration anywhere — lists, RSS, and sitemap auto-discover posts at build time. Never create anything under `docs/en/`.

## Step 8: Self-Check

1. `grep -c '<!-- DESC SEP -->' <file>` returns 2; the summary is 1–2 dense paragraphs.
2. Path `YYYY/MM/DD` == frontmatter `date`; H1 == `title` verbatim; tags 3–8.
3. Every factual claim traces to 素材[n] or is flagged as assumption — no invented quotes or numbers.
4. Image URLs are all real or TODO-marked; math is fenced for MathJax.
5. Re-check after the 去AI味 pass: the guardrail items in Step 6 are intact.
6. Optional: with `npm run docs:dev` running, confirm the post appears on the blog list with its excerpt.

## Step 9: Report, Publish on Confirm, and Hand Off

Report in chat: file path, assumptions made, pending-image list (keep this out of the article). End with:

> 已完成：`docs/posts/YYYY/MM/DD-<slug>.md`（中文全文 + 去AI味 + 摘要 + frontmatter，自检通过）。
> 待你处理：上传 N 张 TODO 图片并替换链接（清单见上）。
> 英文镜像：交给 blog-post-processor 处理这篇文件（中文版已就绪，无需重命名/补摘要，仅翻译）。
> 发布：回复「发布」即提交并 push 到 `release` 分支（commit message `docs: publish <slug>`，Cloudflare Pages 自动部署）；也可以等英文镜像一起发。

When the user replies 发布 (or explicitly confirms publishing), commit the file and push to `release` — the push itself is the deploy. Do not translate or create EN files. Do not commit or push before the explicit confirmation.

## Mistake → Fix

| Mistake | Fix |
|---|---|
| Wrote the file before outline approval | Step 4 is a hard gate; approval is the trigger |
| Book-report voice — summarizes material, no take | Style guide: opinion-first, 先给一句话结论 in the 引子 |
| Invented a quote or number to fill a gap | Flag `〔补查〕` or ask; never fabricate |
| Third or missing `DESC SEP` | `grep -c` must equal 2 before reporting done |
| 去AI味 pass stripped the format or the author's style | Step 6 guardrails; re-run the Step 8 checks after the pass |
| 去AI味 pass deleted a sourced quote as "vague attribution" | Guardrail: named, dated quotes stay; only 专家认为-style unsourced claims go |
| Created the EN mirror itself | Translation belongs to `blog-post-processor` |
| Pushed to `release` without confirmation | Publishing needs an explicit 发布 from the user |
| Interrogated the user across five messages | Batch ≤ 4 questions once, in Step 2 |
| Slug collided, so the date was shifted | Reword the slug; the date is the user's fact |
