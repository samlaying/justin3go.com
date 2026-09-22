---
name: site-publisher
description: >-
  Publish justin3go.com: take finished content (a blog article, a news/arena/
  products entry, a theme change — anything in the working tree) through verify,
  commit, and push to the live site, and explain how the pipeline works
  (file -> commit -> push release -> Cloudflare Pages build -> justin3go.com).
  Triggers: 发布, 上线, 发布上线, 部署, 怎么上线, 如何发布, 从文章到上线,
  "publish", "deploy", "go live". Writing articles belongs to blog-writer;
  content modules have their own recorder skills — this skill owns the last mile.
---

# Site Publisher

The last mile from finished files to the live site, plus the canonical explanation of how this site deploys. Use it whenever the user says 发布 / 上线 / 部署 or asks how the pipeline works.

## How This Site Goes Live (the reference)

```
docs/**/*.md + theme code          (content & components)
        │  npm test / docs:build   (local verify — see Pre-flight)
        ▼
git commit on dev (or a feature branch merged --ff-only into dev)
        │  git push origin dev:release
        ▼
release branch on github.com/samlaying/justin3go.com
        │  Cloudflare Pages auto-build (vitepress build)
        ▼
justin3go.com (+ /en/*)            — live in a few minutes
```

Facts that matter:

- **Deploy = push to `release`.** Nothing else triggers production. Cloudflare Pages watches the `release` branch and runs `npm run docs:build` on every push.
- **Work happens on `dev`** (or a short-lived feature branch). The push is `git push origin dev:release` — a fast-forward of release to dev's HEAD.
- **New pages need no registration.** VitePress routes = files: `docs/<path>.md` → `/<path>` (cleanUrls on). Sitemap picks up new URLs automatically; RSS is regenerated in `buildEnd` (posts only, latest 5 per locale); Algolia crawls on its own schedule.
- **Content modules and their data files**: posts under `docs/posts/` (+ `docs/en/posts/` mirrors), AI news in `docs/.vitepress/theme/news.ts`, arena in `theme/arena.ts`, products in `theme/products.ts` (+ `docs/products/<slug>.md` articles) — editing any of them changes the site on the next deploy.
- **Everything is static.** No server, no runtime secrets. The only moving part between commit and live is the Cloudflare Pages build.

## When This Skill Activates

| Signal | Action |
|---|---|
| 发布 / 上线 / commit + push (after content work) | Full flow below |
| 怎么上线 / how does deploy work | Explain (section above), no action |
| User asks to see changes locally first | Dev server: `npm run docs:dev` → http://localhost:5173 |

## Step 1: Pre-flight (never skip)

1. `npm test` — must be green (data-integrity tests guard every module).
2. `npm run docs:build` — must complete; this is the same build Cloudflare runs. If it fails locally it fails in deploy.
3. `git status` — review what would be committed. **Never stage**: `docs/public/paper-journey/` (4.9M local-only sprites), `.tmp*` scratch dirs, or anything the user didn't ask to publish.

## Step 2: Commit

- Stage exactly the intended files (no `git add -A`).
- One logical change per commit, conventional message (`feat:` / `fix:` / `docs:` / `chore:`), body explains the what; end with the Co-Authored-By footer.
- If work sits on a feature branch: merge with `git checkout dev && git merge --ff-only <branch>` so history stays linear.

## Step 3: Publish — only on explicit user confirmation

The user must have said 发布 / 上线 / commit + push (or equivalent) for THIS batch. Approval of content at a preview gate is not approval to push. Then:

```bash
git push origin dev:release
```

Report the range pushed (e.g. `5c99dd5..0f61c2d dev -> release`) and remind that the site goes live in a few minutes.

## Step 4: Post-deploy check (offer, don't auto-run)

A few minutes after push, verify on the live site — only if the user wants it:

- the changed URLs return 200 and show the new content (e.g. `https://justin3go.com/news`)
- comments (giscus) load on new/changed pages
- `https://justin3go.com/sitemap.xml` contains new URLs

## Mistake → Fix

| Mistake | Fix |
|---|---|
| Pushed without explicit confirmation | — (must not happen; content approval ≠ publish approval) |
| Pushed red tests or a broken build | Fix forward on dev, verify, push again; Cloudflare serves the last good build meanwhile |
| Staged local-only assets (paper-journey sprites, .tmp dirs) | `git restore --staged <paths>` before commit |
| Pushed to dev but expected instant live | Explain: only `release` deploys; push `dev:release` |
| Wrong branch pushed | `git push origin +<old-sha>:release` to rewind only if nothing built yet — otherwise fix forward |
| Merge made a non-ff commit | Rare; acceptable, but prefer `--ff-only` next time |
