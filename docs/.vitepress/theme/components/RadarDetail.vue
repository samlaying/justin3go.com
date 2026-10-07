<template>
	<div v-if="item" class="radar-detail">
		<nav class="radar-detail-back">
			<a :href="withBase(base)">{{ en ? '← Back to AI Radar' : '← 返回 AI 雷达' }}</a>
		</nav>

		<header class="radar-detail-head">
			<p class="radar-detail-kind">
				{{ kindLabel }}<span class="dot">·</span><time>{{ item.date }}</time>
			</p>
			<h1>{{ en ? item.titleEn : item.title }}</h1>
			<p class="radar-detail-summary">{{ en ? item.summaryEn : item.summary }}</p>
			<div class="radar-detail-badges">
				<span class="radar-status" :data-status="item.status">{{ statusLabel }}</span>
				<span class="radar-score">{{ en ? 'SCORE' : '评分' }} {{ item.score.toFixed(1) }} / 5</span>
				<span v-for="topic in item.topics" :key="topic" class="radar-topic">#{{ topic }}</span>
			</div>
		</header>

		<ul v-if="(en ? item.evidenceEn : item.evidence)?.length" class="radar-detail-evidence">
			<li v-for="line in en ? item.evidenceEn : item.evidence" :key="line">{{ line }}</li>
		</ul>

		<section
			v-for="section in questionSections"
			:key="section.no"
			class="radar-detail-question"
			:aria-labelledby="`q-${section.no}`"
		>
			<h2 :id="`q-${section.no}`"><span class="q-no">{{ section.no }}</span>{{ section.title }}</h2>
			<p>{{ section.body }}</p>
		</section>

		<section v-if="en ? item.watchEn : item.watch" class="radar-detail-question radar-detail-watch">
			<h2><span class="q-no">→</span>{{ en ? 'What to watch next' : '接下来观察什么' }}</h2>
			<p>{{ en ? item.watchEn : item.watch }}</p>
		</section>

		<footer v-if="item.relatedBuilds?.length || relatedLinks.length" class="radar-detail-foot">
			<div v-if="relatedLinks.length" class="radar-detail-related">
				<p class="foot-label">{{ en ? 'Related entries' : '相关条目' }}</p>
				<a v-for="link in relatedLinks" :key="link.id" :href="withBase(`${base}/${link.id}`)">{{ en ? link.titleEn : link.title }} <span aria-hidden="true">↗</span></a>
			</div>
			<div v-if="item.relatedBuilds?.length" class="radar-detail-related">
				<p class="foot-label">{{ en ? 'From insight to experiment' : '从判断到实验' }}</p>
				<a v-for="build in item.relatedBuilds" :key="build" :href="withBase(en ? `/en/building/${build}/` : `/building/${build}/`)">
					{{ en ? `Build: ${build}` : `构建线：${build}` }} <span aria-hidden="true">↗</span>
				</a>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useData, withBase } from "vitepress";
import { RADAR_KINDS, RADAR_STATUS_META, radarItems } from "../utils/radarList";

const props = withDefaults(defineProps<{ locale?: "zh" | "en" }>(), { locale: "zh" });
const en = computed(() => props.locale === "en");
const base = computed(() => (en.value ? "/en/radar" : "/radar"));

// 动态路由参数：docs/radar/[id].md 生成的页面里，params.id 即条目 id
const { params } = useData();
const item = computed(() => radarItems.find(entry => entry.id === params.value.id));

// frontmatter 是静态的拿不到条目名，直连时标签页用站名，SPA 进入后补全条目名
onMounted(() => {
	if (item.value) document.title = `${en.value ? item.value.titleEn : item.value.title} · ${en.value ? "AI Radar" : "AI 雷达"} | sam`;
});

const kindLabel = computed(() => {
	const kind = RADAR_KINDS.find(entry => entry.value === item.value?.type);
	return en.value ? kind?.labelEn : kind?.label;
});
const statusLabel = computed(() => {
	const meta = item.value ? RADAR_STATUS_META[item.value.status] : undefined;
	return meta ? `${meta.icon} ${en.value ? meta.labelEn : meta.label}` : "";
});

const questionSections = computed(() => {
	const entry = item.value;
	if (!entry) return [];
	const zh = !en.value;
	return [
		{ no: "01", title: zh ? "它到底是什么" : "What it is", body: zh ? entry.summary : entry.summaryEn },
		{ no: "02", title: zh ? "为什么是现在" : "Why now", body: zh ? entry.whyNow : entry.whyNowEn },
		{ no: "03", title: zh ? "依赖了什么新能力" : "Capability shift", body: zh ? entry.capabilityShift : entry.capabilityShiftEn },
		{ no: "04", title: zh ? "改变了哪些产品设计" : "Product shift", body: zh ? entry.productShift : entry.productShiftEn },
		{ no: "05", title: zh ? "什么场景真有价值" : "Real use case", body: zh ? entry.realUseCase : entry.realUseCaseEn },
		{ no: "06", title: zh ? "落地最大的阻碍" : "Failure / constraint", body: zh ? entry.failure : entry.failureEn },
		{ no: "07", title: zh ? "我的判断" : "My take", body: zh ? entry.myTake : entry.myTakeEn },
	];
});

/** 同类条目互链（排除自己，最多 3 条，按 score 高的在前） */
const relatedLinks = computed(() => {
	const entry = item.value;
	if (!entry) return [];
	return radarItems
		.filter(other => other.id !== entry.id && other.type === entry.type)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);
});
</script>

<style scoped>
.radar-detail {
	--radar-accent: var(--vp-c-brand-1);
}

.radar-detail-back a {
	font-size: 13px;
	color: var(--vp-c-text-2);
	text-decoration: none;
}

.radar-detail-back a:hover {
	color: var(--radar-accent);
}

.radar-detail-head {
	padding-bottom: 26px;
	border-bottom: 1px solid var(--vp-c-divider);
}

.radar-detail-kind {
	margin: 18px 0 10px;
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	letter-spacing: 0.08em;
	color: var(--vp-c-text-3);
}

.radar-detail-kind .dot {
	margin: 0 8px;
}

.radar-detail-head h1 {
	margin: 0;
	font-size: clamp(28px, 4vw, 38px);
	font-weight: 600;
	letter-spacing: -0.03em;
	line-height: 1.35;
}

.radar-detail-summary {
	margin: 14px 0 0;
	font-size: 15px;
	line-height: 1.85;
	color: var(--vp-c-text-2);
	max-width: 640px;
}

.radar-detail-badges {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px 10px;
	margin-top: 18px;
}

.radar-status {
	padding: 2px 10px;
	font-size: 11px;
	white-space: nowrap;
	background: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	border-radius: 999px;
	color: var(--vp-c-text-2);
}

.radar-status[data-status='surge'],
.radar-status[data-status='heating'] {
	color: color-mix(in srgb, #d97706 78%, var(--vp-c-text-1));
	border-color: color-mix(in srgb, #d97706 36%, var(--vp-c-divider));
	background: color-mix(in srgb, #d97706 8%, var(--vp-c-bg));
}

.radar-status[data-status='cooling'] {
	color: color-mix(in srgb, #64748b 80%, var(--vp-c-text-1));
}

.radar-score {
	padding: 2px 10px;
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	color: var(--radar-accent);
	border: 1px solid color-mix(in srgb, var(--radar-accent) 32%, var(--vp-c-divider));
	border-radius: 999px;
}

.radar-topic {
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	color: var(--vp-c-text-3);
}

.radar-detail-evidence {
	margin: 26px 0 0;
	padding: 14px 18px;
	list-style: none;
	background: var(--vp-c-bg-soft);
	border-radius: 8px;
}

.radar-detail-evidence li {
	position: relative;
	padding: 4px 0 4px 18px;
	font-size: 13px;
	line-height: 1.75;
	color: var(--vp-c-text-2);
}

.radar-detail-evidence li::before {
	content: '→';
	position: absolute;
	left: 0;
	color: var(--radar-accent);
}

.radar-detail-question {
	padding: 30px 0;
	border-bottom: 1px dashed var(--vp-c-divider);
}

.radar-detail-question h2 {
	display: flex;
	align-items: baseline;
	gap: 12px;
	margin: 0 0 12px;
	font-size: 17px;
	font-weight: 600;
	letter-spacing: -0.01em;
}

.q-no {
	font-family: var(--vp-font-family-mono);
	font-size: 12px;
	color: var(--radar-accent);
}

.radar-detail-question p {
	margin: 0;
	max-width: 680px;
	font-size: 15px;
	line-height: 1.95;
	color: var(--vp-c-text-2);
}

.radar-detail-watch h2 {
	color: var(--radar-accent);
}

.radar-detail-foot {
	display: grid;
	gap: 22px;
	padding-top: 30px;
}

.foot-label {
	margin: 0 0 10px;
	font-family: var(--vp-font-family-mono);
	font-size: 10px;
	letter-spacing: 0.1em;
	color: var(--vp-c-text-3);
}

.radar-detail-related a {
	display: block;
	padding: 12px 16px;
	margin-top: 8px;
	font-size: 14px;
	color: var(--vp-c-text-1);
	text-decoration: none;
	background: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	transition: border-color 0.2s;
}

.radar-detail-related a:hover {
	border-color: var(--radar-accent);
	color: var(--radar-accent);
}
</style>
