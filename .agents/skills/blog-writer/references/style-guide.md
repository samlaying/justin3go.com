# Style Guide — justin3go.com Posts

Distilled from the 2025–2026 posts. Every dimension cites evidence by repo path; re-distill when ≥ 10 posts newer than the newest cited evidence exist (see Maintenance).

Evidence posts (read them when in doubt):

- `docs/posts/2026/08/15-deepseek-harness-review.md` — deep product review (9.6K chars)
- `docs/posts/2026/07/08-loop-engineering-from-prompting-to-designing-loops.md` — concept teardown (11.7K chars)
- `docs/posts/2026/01/01-hunt0-is-live-ship-early-hunt-early.md` — short launch announcement (2.4K chars)
- `docs/posts/2025/06/21-health-mini-program-after-two-years.md` — personal project retrospective (24K chars)
- `docs/posts/2026/06/04-agent-memory-architecture-guide.md` — deep architecture guide (30K chars)

## Voice

First person 我, addresses the reader as 你. Opinionated and conclusion-first. State the thesis early — the deepseek review puts 一句话结论 in bold before the first section; the loop post opens with a scene, then declares its organizing line ("这篇文章不按调研报告的顺序走，而是沿着…这条主线").

欢迎 personal stakes: time spent, money spent, things the author built or broke. Hedge only where evidence is genuinely split, and say so explicitly (deepseek §4.3 treats benchmark numbers as "透明度问题，而非造假实锤" and walks each claim through 属实 / 部分成立 / 存疑).

Write clean from the start: the evidence posts already read human — concrete, direct, opinionated. The 去AI味 pass (`humanizer-zh`, invoked after drafting) is a safety net, not a license to write slop first. Its final test applies while drafting too: 做事的人说具体的，表演的人说漂亮的.

## Title Patterns

Generate candidates along different axes, recommend one with a reason:

- Colon structure: `X：Y` — 「DeepSeek Harness 深度评测：两天 9 万 star 的『一切皆插件』，是未来还是过度设计？」
- Contrast/shift: 「从"你提示 Agent"到"系统提示 Agent"：Loop Engineering 完整拆解」
- Concrete numbers: 两天 9 万 star, 两年后又捣鼓了一个健康类小程序
- Em-dash subtitle: 「HUNT0 上线了——尽早发布，尽早发现」

## Structure Skeletons

**Standard / deep posts** (deepseek, loop, agent-memory):

```
## 引子：<scene, number, or timeline hook>   ← often ends with 先给一句话结论 in bold
## 一、…        ## 二、…        ## 三、…      (Chinese numeral in the H2 text)
### 1.1 …       ### 1.2 …                     (decimal subsections)
## 结论          or ## 决策：… + ## 尾声：…
```

- 结论 splits into 好在哪 / 差在哪 / 你该不该用它 (persona-based bullets: 你只是想要… → 不推荐; 你在做… → 强烈建议).
- 尾声 echoes the 引子 scene (the loop post ends by returning to its opening engineer).
- Research posts close with `---` then an italic source/timeliness paragraph with links (deepseek ending).

**Short announcements** (hunt0, 2–4K chars): plain `##` sections, no numbering — story hook → 什么是 X → 我们做了什么（1）2）3）小节）→ 开始使用 (CTA). Pick the skeleton from the depth tier, and say which in the outline.

## Evidence Habits

- Comparison tables carry a 一句话 column (loop post: Routine/Workflow/Loop 三分表; criticism table with 批评/代表/核心论点/成立的部分/反驳).
- English originals as blockquote, Chinese translation in parentheses on the next line:
  `> "I don't prompt Claude anymore. …"` followed by `> （我已经不再给 Claude 写 prompt 了。…）`
- Bold the load-bearing term in nearly every paragraph — one bold phrase per paragraph, not five.
- Numbers carry dates and provenance: "2026-08-13 开源", "92,700+ star / 8,400+ fork（GitHub API 实测）", "（该数字为二手、存疑）".
- Community claims are verified then judged: 好评：基本属实 / 差评：大部分也属实 — never passed through unattributed.

## Code and Math

Fenced blocks with language tags (`ts`, `bash`). Comments translated if the source is English. Math via MathJax `$…$` / `$$…$$`.

## Images

Plain `![中文描述](https://oss.justin3go.com/blogs/…)` — alt text is a descriptive Chinese sentence, e.g. `![Prompt→Context→Harness→Loop 四层同心嵌套图](…)`. Place right after first mention; deep dives average ~1 diagram per major section (control-flow, timeline, comparison, decision-matrix diagrams). Click-to-zoom is automatic site-wide — no special syntax.

## Length Tiers (chars incl. punctuation)

| Tier | Range | Evidence |
|---|---|---|
| 随笔 / 发布 | 2–4K | hunt0 (2.4K), how-deepseek-matters (1.8K) |
| 标准篇 | 6–12K | deepseek review (9.6K), loop teardown (11.7K) |
| 深度长文 | 15–30K | health retrospective (24K), agent-memory guide (30K) |

Pick the tier from material volume, state it in the outline. Don't pad a 3K-idea to 10K.

## Summary Recipe (DESC SEP Content)

1–2 dense paragraphs, 2–4 sentences each. Must contain specifics — numbers, names, dates — and end with what the article concludes or delivers, not just the topic. Bold key terms. Examples: the deepseek summary (one paragraph, names the framework, the 9 万 star number, the comparison set, the verification method, and the verdict direction); the hunt0 summary (two paragraphs: what it is, then what v1.0.0 ships).

## Tags Policy

3–8 tags, English proper nouns and product names dominant (`AI Agent`, `Claude Code`, `Coding Agent`); specific projects in kebab-case (`deepseek-harness`). Chinese tag only when the topic is intrinsically Chinese-community (微信小程序). Frontmatter `title` quoted with single quotes when it contains `：` or quotes.

## Maintenance

Newest cited evidence: 2026-08. When ≥ 10 posts newer than that exist, re-distill: re-measure length tiers, check for new structural habits, update evidence paths.
