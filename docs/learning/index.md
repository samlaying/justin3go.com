---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: 学习
description: 在学什么、怎么学、学到哪了：按主题组织的整套学习笔记。
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

技术学习的完整记录，按主题组织成一套套笔记——每套都跟着一个具体的学习路线走。构建产品时踩坑与学习的过程则单独记录在[构建记录](/building/)里。

<h2 class="group-title">语言与基础</h2>

<div class="note-grid">
  <a class="note-card" href="/notes/Python基础/01python数据模型"><span class="note-name">Python 基础</span><span class="note-count">19 篇</span></a>
  <a class="note-card" href="/notes/Rust基础学习/01认识Cargo"><span class="note-name">Rust 基础学习</span><span class="note-count">多篇章</span></a>
  <a class="note-card" href="/notes/JavaScript/"><span class="note-name">JavaScript</span></a>
  <a class="note-card" href="/notes/算法与数据结构/"><span class="note-name">算法与数据结构</span></a>
  <a class="note-card" href="/notes/计算机基础知识/"><span class="note-name">计算机基础知识</span></a>
  <a class="note-card" href="/notes/数据库01/"><span class="note-name">数据库</span></a>
</div>

<h2 class="group-title">前端</h2>

<div class="note-grid">
  <a class="note-card" href="/notes/Vue相关/"><span class="note-name">Vue 相关</span></a>
  <a class="note-card" href="/notes/CSS相关/"><span class="note-name">CSS 相关</span></a>
  <a class="note-card" href="/notes/threejs入门/01起步"><span class="note-name">threejs 入门</span><span class="note-count">12 篇</span></a>
  <a class="note-card" href="/notes/微前端设计与实现/01前端概览"><span class="note-name">微前端设计与实现</span></a>
  <a class="note-card" href="/notes/前端八股文/"><span class="note-name">前端八股文</span></a>
</div>

<h2 class="group-title">后端</h2>

<div class="note-grid">
  <a class="note-card" href="/notes/NestJS/"><span class="note-name">NestJS</span></a>
  <a class="note-card" href="/notes/后端储备/"><span class="note-name">后端储备</span><span class="note-count">Django · DRF · Redis</span></a>
</div>

<h2 class="group-title">AI</h2>

<div class="note-grid">
  <a class="note-card" href="/notes/AI相关/"><span class="note-name">AI 相关</span></a>
  <a class="note-card" href="/notes/ChatGPT提示学习/ChatGPT提示学习笔记1_2"><span class="note-name">ChatGPT 提示学习</span></a>
</div>

<h2 class="group-title">其他</h2>

<div class="note-grid">
  <a class="note-card" href="/notes/Web3.0/"><span class="note-name">Web3.0</span></a>
</div>

<style lang="scss" scoped>
.group-title {
	margin-top: 48px;
	font-size: 22px;
	font-weight: 550;

	&:first-of-type {
		margin-top: 32px;
	}
}

.note-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 12px;
	margin-top: 16px;
}

.note-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 14px 18px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 10px;
	transition: border-color 0.25s;

	&:hover {
		border-color: var(--vp-c-brand-1);
	}
}

.note-name {
	font-size: 14px;
	font-weight: 500;
}

.note-count {
	font-size: 12px;
	color: var(--vp-c-text-3);
	white-space: nowrap;
}
</style>
