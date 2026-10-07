---
layout: doc
title: AI Radar
description: Tracking the tech, products, and trends that matter to AI PMs — why now, what shifts in product design, and what I think it means.
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

This is not a news feed. AI can summarize launches on its own; what gets recorded here is **judgment** — every radar entry answers the same questions: why did this happen now, what does it change in product design, where is the real opportunity, and where is the hype.

Statuses and scores are my own calls, not popularity rankings. Entries get re-judged as my understanding updates, and cooled ones stay on the board — recording where I was wrong is as valuable as recording where I was right.

<RadarBoard locale="en" />

## Analysis protocol

Whether the subject is a product, a technology, or a trend, every full analysis answers the same seven questions:

1. **What** — what exactly is it?
2. **Why Now** — why is it appearing right now?
3. **Capability Shift** — what new model or engineering capability does it rely on?
4. **Product Shift** — what product design does it change?
5. **Real Use Case** — which scenarios genuinely need it? Which don't?
6. **Failure / Constraint** — what is the biggest blocker to real adoption?
7. **My Take** — my call, what to watch next, and what it means for what I'm building.

Judgment ships before publishing: a candidate passes a scoring pass first (technical change, product impact, discussion growth, real behavior change, relevance to what I'm building); only what clears the bar is worth answering the seven questions for.

<h2 class="radar-more-title">Related</h2>

<div class="radar-more">
	<a class="more-card" href="/en/news">
		<span class="more-name">AI News</span>
		<span class="more-desc">Model releases and product updates, with one-line takes</span>
	</a>
	<a class="more-card" href="/en/benchmark">
		<span class="more-name">Competitor Analysis</span>
		<span class="more-desc">One standard, run across products — reproducible differences only</span>
	</a>
	<a class="more-card" href="/en/building">
		<span class="more-name">Building</span>
		<span class="more-desc">Judgments turned into experiments: pitfalls, prompts, lessons</span>
	</a>
</div>

<script lang="ts" setup>
import RadarBoard from "../.vitepress/theme/components/RadarBoard.vue";
</script>

<style lang="scss" scoped>
.radar-more-title {
	margin-top: 70px;
	font-size: 18px;
	font-weight: 550;
	border-top: 0;
}

.radar-more {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
	gap: 12px;
	margin-top: 16px;
}

.more-card {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 16px 18px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 10px;
	text-decoration: none;
	transition: border-color 0.25s;

	&:hover {
		border-color: var(--vp-c-brand-1);
	}

	.more-name {
		font-size: 14px;
		font-weight: 550;
	}

	.more-desc {
		font-size: 12px;
		line-height: 1.7;
		color: var(--vp-c-text-3);
	}
}
</style>
