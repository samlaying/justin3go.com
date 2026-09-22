<template>
	<div class="arena-board">
		<section class="arena-rules" :aria-label="locale === 'en' ? 'Arena rules' : '竞技场规则'">
			<p class="arena-rules-title">{{ locale === 'en' ? 'How this arena works' : '这套竞技场怎么跑' }}</p>
			<ul>
				<li>{{ locale === 'en' ? 'A fixed suite of 8 prompts — every model runs the exact same text.' : '固定 8 道题库，所有模型跑同一份逐字原文。' }}</li>
				<li>{{ locale === 'en' ? 'Answers are stored verbatim: never paraphrased, never written on a model\'s behalf.' : '答案逐字照录：不改写，也不代写没跑过的模型。' }}</li>
				<li>{{ locale === 'en' ? 'Each answer is labeled by source: live call (in-session) or user-provided paste.' : '每条答案标注来源：现场调用（会话内）或用户提供。' }}</li>
				<li>{{ locale === 'en' ? 'No scores, no blind mode — only sam\'s verdict under each round.' : '无评分、无盲测，每场下面只有 sam 的点评。' }}</li>
			</ul>
			<p class="arena-stats">{{ locale === 'en' ? `${arenaPrompts.length} prompts · ${rounds.length} rounds · ${modelCount} models` : `${arenaPrompts.length} 道题 · ${rounds.length} 场对决 · ${modelCount} 个模型` }}</p>
		</section>

		<h2 class="arena-section-title">{{ locale === 'en' ? 'The Fixed Prompt Suite' : '固定题库' }}</h2>
		<div class="prompt-grid">
			<article v-for="(prompt, i) in arenaPrompts" :key="prompt.id" class="prompt-card">
				<header>
					<span class="arena-chip">{{ categoryLabel(prompt.category, locale) }}</span>
					<span class="prompt-index">{{ String(i + 1).padStart(2, '0') }}</span>
				</header>
				<h3>{{ prompt.title[locale] }}</h3>
				<pre class="prompt-text">{{ prompt.prompt }}</pre>
				<p class="prompt-note">{{ prompt.note[locale] }}</p>
			</article>
		</div>

		<h2 class="arena-section-title">{{ locale === 'en' ? 'All Rounds' : '全部场次' }}</h2>
		<p v-if="!rounds.length" class="arena-empty">{{ locale === 'en' ? 'No rounds recorded yet.' : '还没有场次记录。' }}</p>
		<section v-for="round in rounds" :key="round.date + round.promptId" class="arena-round">
			<header class="round-header">
				<time>{{ round.date }}</time>
				<h3 v-if="promptOf(round)">{{ promptOf(round)!.title[locale] }}</h3>
				<span v-if="promptOf(round)" class="arena-chip">{{ categoryLabel(promptOf(round)!.category, locale) }}</span>
			</header>
			<details v-if="promptOf(round)" class="round-prompt">
				<summary>{{ locale === 'en' ? 'Prompt (verbatim)' : '原题回顾（逐字）' }}</summary>
				<pre class="prompt-text">{{ promptOf(round)!.prompt }}</pre>
			</details>
			<div class="answer-grid">
				<article v-for="answer in round.answers" :key="answer.model + answer.date" class="answer-card">
					<header>
						<strong>{{ answer.model }}</strong>
						<span class="answer-meta">{{ answer.date }} · {{ sourceLabel(answer.source, locale) }}</span>
					</header>
					<details v-if="answer.answer.length > 600" class="answer-body" open>
						<summary>{{ locale === 'en' ? `Collapse (${answer.answer.length} chars)` : `收起（${answer.answer.length} 字）` }}</summary>
						<div class="answer-markdown" v-html="render(answer.answer)"></div>
					</details>
					<div v-else class="answer-markdown" v-html="render(answer.answer)"></div>
				</article>
			</div>
			<div class="arena-verdict">
				<p class="verdict-label">{{ locale === 'en' ? "sam's verdict" : 'sam 的点评' }}</p>
				<p>{{ round.verdict[locale] }}</p>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";
import { arenaPrompts, arenaRounds, type ArenaRound } from "../arena";
import { categoryLabel, findPrompt, sortRoundsDesc, sourceLabel } from "../utils/arenaList";

const props = withDefaults(defineProps<{ locale?: "zh" | "en" }>(), {
	locale: "zh",
});

// html:false 逐字转义第三方文本里的原始 HTML，是 v-html 的安全防线
const md = new MarkdownIt({ html: false, breaks: true, linkify: false, typographer: false });

const rounds = computed(() => sortRoundsDesc(arenaRounds));
const modelCount = computed(() => new Set(arenaRounds.flatMap(round => round.answers.map(answer => answer.model))).size);

function promptOf(round: ArenaRound) {
	return findPrompt(arenaPrompts, round.promptId);
}

function render(text: string): string {
	return md.render(text);
}
</script>

<style scoped>
.arena-board { display: grid; gap: 28px; }
.arena-rules { padding: 18px 22px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 4px; }
.arena-rules-title { margin: 0 0 10px; font-size: 14px; font-weight: 550; }
.arena-rules ul { margin: 0; padding-left: 18px; }
.arena-rules li { font-size: 13px; line-height: 1.9; color: var(--vp-c-text-2); }
.arena-stats { margin: 12px 0 0; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-3); letter-spacing: .05em; }
.arena-section-title { margin: 22px 0 0; font-size: 20px; font-weight: 550; letter-spacing: -.02em; }
.arena-empty { font-size: 13px; color: var(--vp-c-text-2); }
.prompt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.prompt-card { display: flex; flex-direction: column; padding: 16px 18px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg); }
.prompt-card header { display: flex; justify-content: space-between; align-items: center; }
.arena-chip { padding: 2px 8px; border: 1px solid var(--vp-c-brand-1); border-radius: 999px; color: var(--vp-c-brand-1); font: 10px var(--vp-font-family-mono); white-space: nowrap; }
.prompt-index { font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
.prompt-card h3 { margin: 10px 0 0; font-size: 15px; font-weight: 550; }
.prompt-text { margin: 10px 0 0; padding: 12px 14px; background: var(--vp-c-bg-soft); border-radius: 4px; font: 12px/1.8 var(--vp-font-family-mono); white-space: pre-wrap; word-break: break-word; color: var(--vp-c-text-1); }
.prompt-note { margin: 10px 0 0; font-size: 12px; line-height: 1.8; color: var(--vp-c-text-3); }
.arena-round { display: grid; gap: 14px; padding: 20px 0 26px; border-bottom: 1px dashed var(--vp-c-divider); }
.round-header { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
.round-header time { font: 11px var(--vp-font-family-mono); color: var(--vp-c-text-2); }
.round-header h3 { margin: 0; font-size: 17px; font-weight: 550; }
.round-prompt summary { font-size: 12px; color: var(--vp-c-text-3); cursor: pointer; }
.answer-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.answer-card { padding: 16px 18px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg); min-width: 0; }
.answer-card header { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.answer-card strong { font-size: 14px; font-weight: 550; }
.answer-meta { font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-3); white-space: nowrap; }
.answer-body summary { font: 11px var(--vp-font-family-mono); color: var(--vp-c-text-3); cursor: pointer; margin-bottom: 10px; }
.answer-markdown { font-size: 13px; line-height: 1.85; color: var(--vp-c-text-2); }
.answer-markdown :deep(p) { margin: 0 0 10px; }
.answer-markdown :deep(p:last-child) { margin-bottom: 0; }
.answer-markdown :deep(ol), .answer-markdown :deep(ul) { margin: 0 0 10px; padding-left: 20px; }
.answer-markdown :deep(li) { margin: 4px 0; }
.answer-markdown :deep(h1), .answer-markdown :deep(h2), .answer-markdown :deep(h3), .answer-markdown :deep(h4) { margin: 14px 0 8px; font-size: 14px; font-weight: 550; color: var(--vp-c-text-1); }
.answer-markdown :deep(pre) { padding: 10px 12px; background: var(--vp-c-bg-soft); border-radius: 4px; overflow-x: auto; font-size: 12px; }
.answer-markdown :deep(code) { font: 12px var(--vp-font-family-mono); }
.answer-markdown :deep(strong) { color: var(--vp-c-text-1); }
.arena-verdict { padding: 14px 18px; background: var(--vp-c-bg-soft); border-left: 2px solid var(--vp-c-brand-1); border-radius: 0 4px 4px 0; }
.verdict-label { margin: 0 0 6px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-brand-1); letter-spacing: .05em; }
.arena-verdict p:last-child { margin: 0; font-size: 13px; line-height: 1.9; color: var(--vp-c-text-2); }
@media (max-width: 768px) { .prompt-grid, .answer-grid { grid-template-columns: 1fr; } }
</style>
