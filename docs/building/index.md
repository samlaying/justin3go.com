---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: 构建记录
description: 每个 AI 产品从想法到上线的完整过程：AI 技术踩坑、真实提示词、怎么学、学到什么。
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

这里记录每个产品的构建过程，而不只是结果。每条构建日志都按同一个结构写：**踩坑记录**（遇到什么问题、怎么定位、怎么解决）、**提示词**（与 AI 协作时真实使用的 prompt 原文）、**学到什么**（这一步的收获与反思）。

<div class="build-series">

<a class="series-card" href="/building/hunt0/">
  <div class="series-head">
    <span class="series-name">HUNT0</span>
    <span class="series-status">已上线</span>
  </div>
  <p class="series-desc">面向 maker 与 indie hacker 的社区驱动发布目录：launch → discover → vote → discuss → recap。</p>
  <span class="series-enter">进入构建线 →</span>
</a>

<a class="series-card" href="/building/site/">
  <div class="series-head">
    <span class="series-name">本站 justin3go.com</span>
    <span class="series-status series-status--ongoing">持续重构</span>
  </div>
  <p class="series-desc">纸感拼贴风格的个人站：模块设计、AI 协作重建、以及站点本身的演进过程。</p>
  <span class="series-enter">进入构建线 →</span>
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
