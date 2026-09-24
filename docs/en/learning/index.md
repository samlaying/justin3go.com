---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: Learning
description: What I'm learning, how, and where it stands — study notes organized by topic.
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
aside: false
---

Study notes organized by topic — each section follows a concrete learning path. The build-side learning (pitfalls and lessons from making products) lives separately in [Building](/en/building/).

<h2 class="group-title">Languages & CS Fundamentals</h2>

<div class="note-grid">
  <a class="note-card" href="/en/notes/Python基础/01python数据模型"><span class="note-name">Python</span><span class="note-count">19 notes</span></a>
  <a class="note-card" href="/en/notes/Rust基础学习/01认识Cargo"><span class="note-name">Rust</span></a>
  <a class="note-card" href="/en/notes/JavaScript/"><span class="note-name">JavaScript</span></a>
  <a class="note-card" href="/en/notes/算法与数据结构/"><span class="note-name">Algorithms & Data Structures</span></a>
  <a class="note-card" href="/en/notes/计算机基础知识/"><span class="note-name">CS Fundamentals</span></a>
  <a class="note-card" href="/en/notes/数据库01/"><span class="note-name">Databases</span></a>
</div>

<h2 class="group-title">Frontend</h2>

<div class="note-grid">
  <a class="note-card" href="/en/notes/Vue相关/"><span class="note-name">Vue</span></a>
  <a class="note-card" href="/en/notes/CSS相关/"><span class="note-name">CSS</span></a>
  <a class="note-card" href="/en/notes/threejs入门/01起步"><span class="note-name">three.js</span><span class="note-count">12 notes</span></a>
  <a class="note-card" href="/en/notes/微前端设计与实现/01前端概览"><span class="note-name">Micro-frontends</span></a>
  <a class="note-card" href="/en/notes/前端八股文/"><span class="note-name">Frontend Fundamentals</span></a>
</div>

<h2 class="group-title">Backend</h2>

<div class="note-grid">
  <a class="note-card" href="/en/notes/NestJS/"><span class="note-name">NestJS</span></a>
  <a class="note-card" href="/en/notes/后端储备/"><span class="note-name">Backend Basics</span><span class="note-count">Django · DRF · Redis</span></a>
</div>

<h2 class="group-title">AI</h2>

<div class="note-grid">
  <a class="note-card" href="/en/notes/AI相关/"><span class="note-name">AI</span></a>
  <a class="note-card" href="/en/notes/ChatGPT提示学习/ChatGPT提示学习笔记1_2"><span class="note-name">Prompting</span></a>
</div>

<h2 class="group-title">Other</h2>

<div class="note-grid">
  <a class="note-card" href="/en/notes/Web3.0/"><span class="note-name">Web3.0</span></a>
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
