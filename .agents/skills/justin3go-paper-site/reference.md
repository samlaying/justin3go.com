# Visual system and post format

Read this when implementing tokens, homepage CSS, or blog markdown.

## Two surfaces

| Surface | Feel | Stack |
| --- | --- | --- |
| Shell (nav, blog, archive, article) | Quiet docs | VitePress default + brand + fonts |
| `/` homepage | Journal / torn paper / postcard / letter | Custom page, not doc layout |

## Color

One brand pair. Light = paper white + blue. Dark = VitePress charcoal + gold. Derive decorations from `var(--vp-c-brand-*)`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| Brand 1 | `#2949a4` | `#aa9100` | Primary button, selection, H1 line 2, current timeline |
| Brand 2 | `#0749ff` | `#d5b811` | Hover |
| Brand 3 | `#7494ec` | `#ecce23` | Soft accent |
| Brand soft | `rgba(110,156,190,0.14)` | `rgba(186,186,186,0.14)` | Highlight wash |
| Paper sheet | `color-mix(in srgb, var(--vp-c-bg) 94%, var(--vp-c-brand-1) 6%)` | same | Notes, letter, lined pad |

Selection: `background: var(--vp-c-brand-1); color: var(--vp-c-bg)`.

## Type

| Role | Font | Where |
| --- | --- | --- |
| Logo | Niconne (subset to the site name) | Nav title ~24px |
| Body | PingFang SC / Microsoft YaHei + system sans | Articles, home copy |
| Date display | Source Han Serif CN (optional subset) | Blog list hollow dates |
| Mono | Fira Code | Kicker, chapter numbers, years, stamp |
| Scribble | Georgia italic | `hello, world.`, letter signature |

Home rhythm: kicker/eyebrow 10–11px, tracking 0.09–0.12em; body 14–15px, line-height 1.9–1.95.

## Motifs (recognition)

No rounded marketing cards, no blurry drop shadows, no purple gradients.

1. Torn paper: irregular `clip-path: polygon(...)`. Two H1 sheets; second line rotated the other way with brand wash.
2. Tape: translucent strip, about -8° to -10°.
3. Lined note: `repeating-linear-gradient` ~29px.
4. Hard offset shadow: `box-shadow: 2px 6px 0` solid mix, not blur.
5. Micro rotate: cards -1.2°, buttons -1.2° / +1.2°, hover to 0 and `translateY(-2px)`.
6. Chapter index: `01` in mono inside a dashed box.
7. Arrows: `↗` external, `↘` in-page, `↑` back to top.

## Layout

- Width: `min(calc(var(--vp-layout-max-width) - 64px), calc(100% - 64px))` (~1376px).
- Desktop home: split spreads; art/copy sides alternate (work left, about right, play left, journey right, contact left).
- Breakpoint 860px: paper person/art only on hero, then hide. No sticky mini-character.
- Opaque nav background.
- Sticky in-page nav for Work / About / Journey / Contact.

## Motion

Reveal on intersection. No wheel hijack, no mandatory snap. `prefers-reduced-motion`: static pose, no paper-reassembly loop. Animated paper character is optional; CSS tape + lined paper is enough.

## IA

```
/            collage home
/blog        paginated list
/posts/...   article
/archive     by year (optional)
/support-me  sponsor (optional)
/friends     links (optional)
/en/...      English mirror (optional)
```

Nav: Home · Blog · Archive · (Sponsor). Social: X / GitHub / RSS as fits intake.

## Post markdown

```markdown
---
title: 中文标题
date: 2026-09-06
tags:
  - Tag1
  - Tag2
---

# 中文标题

> ✨文章摘要（AI生成）
>
<!-- DESC SEP -->
>
> Two to four sentences.
>
<!-- DESC SEP -->

Body…
```

File: `docs/posts/YYYY/MM/DD-english-slug.md`. English mirror: same filename under `docs/en/posts/`, translate title and body, keep `date` and `tags`.

Excerpt extraction depends on **exactly two** `DESC SEP` markers.

## Project cards

Need: name, domain, URL, one sentence for **who it's for**, 16:9 desktop screenshot (~1200×675). Not an app-icon grid. Not a tech-stack list.

## Copy

Spoken short lines. Include made things + one slice of life. Bad: 「热爱创新，赋能数字化转型。」 Good: 「写代码，也收集生活的碎片。」
