---
name: justin3go-paper-site
description: >-
  Builds a Justin3go-style personal site from scratch: VitePress docs shell plus a
  paper-journal collage homepage (torn-paper titles, tape, lined notes, postcard
  project cards, letter contact). Use whenever the user wants a personal site,
  portfolio blog, VitePress blog, 个人站, 博客, 作品集, 从0到1, 撕纸, 手帐, 拼贴首页,
  justin3go style, paper collage homepage, or to clone this site's look for someone
  else. Also use when they say 按这个风格做、做成技能里那种站、重建首页、新博客站点.
  Do not wait for them to name this skill.
---

# Justin3go Paper Site

Build a personal site with this DNA: **docs shell is quiet VitePress; homepage is a taped paper journal.** Do not put torn-paper chrome on article pages.

Work in the current workspace. If the folder is empty or unrelated, scaffold VitePress there. Do not dump a client's identity into `justin3go.com` unless they are editing this repo on purpose.

## First action

1. Read [reference.md](reference.md) before writing UI CSS or homepage components.
2. Inventory what the user already gave (name, bio, avatar, projects, posts).
3. If any **Must** field is missing, **stop coding the homepage**. Send the intake in [intake.md](intake.md) once. You may scaffold the VitePress shell (Step A) in parallel.
4. Never invent a real person's name, email, projects, or life story. Placeholders like `Your Name` are forbidden in shipped UI.

Must: site name, one-line role · city, two-line headline, two intro sentences, motto, square avatar, email, language (zh / en / both), nav scope (blog / archive / notes / sponsor).

Should (site looks like a person, not a theme): 4–8 projects with 16:9 screenshots, 4–8 timeline rows, two life slices, 2–5 socials.

Nice: paper-character sprites, real posts, Giscus, search, RSS, i18n.

Do not ask for a color palette, component library, or a full design file. Brand is locked in reference.md.

## Workflow

Copy and keep this list updated:

```
- [ ] Intake (Must complete)
- [ ] A Shell: VitePress + brand tokens + nav
- [ ] B Blog: post path + DESC SEP + list + pagination
- [ ] C Home: hero → sticky nav → work → about → journey → letter
- [ ] D Optional: RSS / OG / comments / search / i18n
- [ ] Browser check (desktop + ~390px, light + dark)
```

### A — Shell

VitePress + `pnpm`. Brand CSS: light `#2949a4`, dark `#aa9100`. Logo font handwritten (Niconne or equivalent), code Fira Code. Opaque top nav. Title, description, favicon, footer from intake.

Pass: appearance toggle turns links/buttons blue ↔ gold.

### B — Blog

Path: `docs/posts/YYYY/MM/DD-english-slug.md`. Frontmatter: `title`, `date`, `tags`. Excerpt **must** sit between exactly two `<!-- DESC SEP -->` markers. List page: big title, serif hollow date, outline tags, excerpt, pagination.

If they have no posts: empty list is OK when they said so; otherwise write nothing fake—ask whether to leave empty or draft 3 real outlines from their topics.

Pass: at least the list route renders without dummy "lorem" authors.

### C — Home

`layout: page`. Build in this order, each block shippable:

1. Hero: avatar, identity, mono kicker, two torn-paper H1 lines, two sentences, primary `↘` (in-page) + secondary `↗` (blog).
2. Static paper field: lined sheet, tape, stamp, italic scribble. Skip animated paper-person unless they provided sprites.
3. Sticky chapter nav: Work / About / Journey / Contact; highlight on scroll.
4. Work: postcard cards (number + domain + one sentence + 16:9). Extra projects as text rows.
5. About: two life cards (not a résumé stack).
6. Timeline: newest first; current dot uses brand.
7. Contact: letter sheet, oversized email, socials, italic signature.

Desktop: split spread, art/copy sides alternate. Below `860px`: character/art only on hero, no mini person bar. No wheel hijack, no scroll snap. Honor `prefers-reduced-motion`.

Copy voice: short, spoken, product + a slice of life. Eyebrows like `01 / SELECTED WORK`. Primary CTA is a concrete verb, never「了解更多」.

### D — Launch extras

Only if requested or Must/Should already shipped: RSS, sitemap, OG, image zoom, Giscus, Algolia or local search, `/en` mirror, analytics.

## Implementation notes

When this repo (`justin3go.com`) is the workspace and they want the same stack: reuse `.vitepress/theme` patterns (`ProfileHome`, `style.css`, posts loader). When building for someone else in a new folder: copy the **visual rules**, not Justin's copy, avatars, or project list.

Article format and tokens: [reference.md](reference.md).

## Acceptance

- Light: primary button deep blue. Dark: gold.
- Logo is script, not default sans.
- H1 is two slightly rotated torn sheets, not one plain heading.
- Chapter nav sticks and highlights.
- Project cards read as taped postcards, not rounded shadow cards.
- Contact is a letter; email is visually louder than body.
- No horizontal overflow at 860px and ~390px; art must not cover headings.
- Reduced motion still readable and clickable.
- Blog list shows date + tags + excerpt.
- Shipped strings are the user's facts only.

Verify in the browser before declaring done. If browser tools are missing, run `pnpm docs:dev` and say what you could not click.

## Anti-patterns

- Purple glow, glassmorphism, 3-column icon grids, Inter/Roboto as the brand face.
- Torn `clip-path` on Markdown article chrome.
- Invented paper-person or fake projects to fill the grid.
- Asking 10 competitor URLs or a Figma file before writing code.
