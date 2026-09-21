---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: 最近 AI 动态
description: 模型发布、产品更新与行业动态，附一句话点评，由 sam 手动维护。
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
---

<!-- 与 blog.md 同理，列表写在 md 里而非 Vue 组件（aside 不会动态刷新） -->
<template v-for="[month, group] in monthGroups" :key="month">
  <h2 :id="month" class="news-month">{{ monthLabel(month, 'zh') }}</h2>
  <article v-for="item in group" :key="item.url" class="news-row">
    <time>{{ item.date }}</time>
    <div>
      <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title.zh }} <span aria-hidden="true">↗</span></a>
      <span class="news-meta">{{ kindLabel(item.kind, 'zh') }} · {{ item.source }}</span>
      <p>{{ item.comment.zh }}</p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { news } from "./.vitepress/theme/news.ts";
import { sortNewsDesc, groupNewsByMonth, kindLabel, monthLabel } from "./.vitepress/theme/utils/newsList.ts";

const monthGroups = groupNewsByMonth(sortNewsDesc(news));
</script>

<style lang="scss" scoped>
.news-month {
	margin-top: 60px;
	font-size: 22px;
	font-weight: 550;

	&:first-of-type {
		margin-top: 20px;
	}
}

.news-row {
	display: grid;
	grid-template-columns: 90px minmax(0, 1fr);
	gap: 0 20px;
	padding: 20px 0;
	border-bottom: 1px dashed var(--vp-c-divider);

	time {
		padding-top: 4px;
		font-family: var(--vp-font-family-mono);
		font-size: 12px;
		color: var(--vp-c-text-2);
	}

	a {
		font-size: 16px;
		font-weight: 550;
		text-decoration: none;

		span {
			font-size: 13px;
			opacity: 0.55;
			margin-left: 2px;
		}

		&:hover {
			color: var(--vp-c-brand-1);
		}
	}

	.news-meta {
		display: block;
		margin-top: 5px;
		font-family: var(--vp-font-family-mono);
		font-size: 10px;
		color: var(--vp-c-text-3);
	}

	p {
		margin: 8px 0 0;
		font-size: 13px;
		line-height: 1.8;
		color: var(--vp-c-text-2);
	}

	@media (max-width: 640px) {
		grid-template-columns: 74px minmax(0, 1fr);
		gap: 0 12px;
	}
}
</style>
