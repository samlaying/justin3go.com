---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: Building
description: "The full build process of each AI product: pitfalls, real prompts, what I learned along the way."
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

This is where I document how each product gets built — not just the result. Every build log entry follows the same structure: **Pitfalls** (what broke, how I tracked it down, how I fixed it), **Prompts** (the actual prompts I used when working with AI), and **What I Learned** (takeaways and reflections).

<div class="build-series">

<a class="series-card" href="/en/building/hunt0/">
  <div class="series-head">
    <span class="series-name">HUNT0</span>
    <span class="series-status">Launched</span>
  </div>
  <p class="series-desc">A community-driven launch directory for makers and indie hackers: launch → discover → vote → discuss → recap.</p>
  <span class="series-enter">Open build log →</span>
</a>

<a class="series-card" href="/en/building/site/">
  <div class="series-head">
    <span class="series-name">This Site</span>
    <span class="series-status series-status--ongoing">Ongoing</span>
  </div>
  <p class="series-desc">The paper-collage personal site itself: module design, AI-assisted rebuilds, and how the site evolves.</p>
  <span class="series-enter">Open build log →</span>
</a>

</div>

<style lang="scss" scoped>
.build-series {
	margin-top: 32px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.series-card {
	display: block;
	padding: 24px 28px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 10px;
	transition: border-color 0.25s, transform 0.25s;

	&:hover {
		border-color: var(--vp-c-brand-1);
		transform: translateY(-2px);
	}
}

.series-head {
	display: flex;
	align-items: center;
	gap: 12px;
}

.series-name {
	font-size: 19px;
	font-weight: 600;
}

.series-status {
	font-size: 12px;
	padding: 2px 10px;
	border-radius: 999px;
	border: 1px solid var(--vp-c-brand-1);
	color: var(--vp-c-brand-1);

	&--ongoing {
		border-color: var(--vp-c-divider);
		color: var(--vp-c-text-3);
	}
}

.series-desc {
	margin: 10px 0 0;
	font-size: 14px;
	color: var(--vp-c-text-2);
}

.series-enter {
	display: inline-block;
	margin-top: 14px;
	font-size: 13px;
	color: var(--vp-c-brand-1);
}
</style>
