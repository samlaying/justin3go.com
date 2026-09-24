---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: 本站构建线
description: justin3go.com 自己的构建过程：纸感拼贴设计、AI 协作重建、模块演进。
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
---

本站自己就是一个持续构建中的产品：纸感拼贴风格的首页（撕纸标题、胶带、横线便签、明信片项目卡）、博客、AI 实验室的各个模块，都在这里记录设计与重建过程。

## 时间线

<article class="log-row">
  <time>2026-09-23</time>
  <div>
    <a href="/posts/2026/09/23-three-modules-in-one-day-with-claude-code">一天三个模块：与 Claude Code 的 22 小时</a>
    <p>用 Claude Code 在一天内重建站点的三个模块，过程与复盘。</p>
  </div>
</article>

## 构建日志

<!-- 构建日志条目模板：按时间倒序往下加，结构与含义见 /building/ 首页说明。

<article class="log-row">
  <time>YYYY-MM-DD</time>
  <div>
    <h3>这一步做了什么</h3>

    <h4>踩坑记录</h4>
    <p>遇到什么问题、怎么定位、怎么解决。</p>

    <h4>提示词</h4>
    <pre><code>与 AI 协作时真实使用的 prompt 原文</code></pre>

    <h4>学到什么</h4>
    <p>这一步的收获与反思。</p>
  </div>
</article>
-->

<style lang="scss" scoped>
.log-row {
	display: grid;
	grid-template-columns: 90px minmax(0, 1fr);
	gap: 0 20px;
	padding: 20px 0;
	border-bottom: 1px dashed var(--vp-c-divider);

	time {
		color: var(--vp-c-text-3);
		font-size: 13px;
		padding-top: 3px;
		font-variant-numeric: tabular-nums;
	}

	p {
		margin: 8px 0 0;
		font-size: 14px;
		color: var(--vp-c-text-2);
	}
}
</style>
