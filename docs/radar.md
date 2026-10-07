---
layout: doc
title: AI 雷达
description: 持续追踪值得 AI 产品经理关注的技术、产品与趋势：为什么是现在、改变了什么产品设计、我的判断是什么。
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

这不是新闻聚合。AI 自己就能总结发布信息，这里要留下的是**判断**——每条雷达记录回答同样的问题：为什么偏偏是现在、它改变了什么产品设计、哪里是真机会、哪里只是噱头。

状态与评分都是我的主观判断，不是热度排行。条目会随认知更新而改判，降温的也留在板上——记录「我看走眼了什么」和记录「我看对了什么」一样有价值。

<RadarBoard locale="zh" />

## 分析协议

无论追踪的是产品、技术还是趋势，每条完整分析回答同样七个问题：

1. **What** —— 它到底是什么？
2. **Why Now** —— 为什么偏偏现在出现？
3. **Capability Shift** —— 它依赖了什么新的模型 / 工程能力？
4. **Product Shift** —— 它改变了哪些产品设计？
5. **Real Use Case** —— 什么场景真的有价值？什么场景其实没必要？
6. **Failure / Constraint** —— 真正落地最大的阻碍是什么？
7. **My Take** —— 我的判断、接下来观察什么、对我正在做的产品有什么启发？

判断先于发布：候选热点先过一道评分（技术变化、产品影响、讨论增长、真实行为变化、与我在做的事的相关性），过线的才值得花时间回答七问。

<h2 class="radar-more-title">相关栏目</h2>

<div class="radar-more">
	<a class="more-card" href="/news">
		<span class="more-name">AI 动态</span>
		<span class="more-desc">模型发布与产品更新，附一句话点评</span>
	</a>
	<a class="more-card" href="/benchmark">
		<span class="more-name">竞品分析</span>
		<span class="more-desc">同一道题横向跑不同产品，只记可复现的差别</span>
	</a>
	<a class="more-card" href="/building">
		<span class="more-name">构建记录</span>
		<span class="more-desc">判断落地为实验：踩坑、提示词、学到什么</span>
	</a>
</div>

<script lang="ts" setup>
import RadarBoard from "./.vitepress/theme/components/RadarBoard.vue";
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
