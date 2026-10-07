<template>
	<div class="radar-board">
		<header class="radar-head">
			<p class="radar-updated">
				{{ en ? 'Last updated' : '最近更新' }}
				<time>{{ updatedLabel }}</time>
				<span class="radar-count">{{ en ? `${radarItems.length} items` : `${radarItems.length} 条在跟踪` }}</span>
			</p>
			<div class="radar-tabs" role="tablist" :aria-label="en ? 'Filter by kind' : '按类型过滤'">
				<button
					v-for="kind in RADAR_KINDS"
					:key="kind.value"
					type="button"
					role="tab"
					:class="{ active: activeKind === kind.value }"
					:aria-selected="activeKind === kind.value"
					@click="activeKind = kind.value"
				>
					{{ en ? kind.labelEn : kind.label }}
					<span class="radar-tab-count">{{ countOf(kind.value) }}</span>
				</button>
			</div>
		</header>

		<article v-if="featured" class="radar-featured" :class="`is-${featured.status}`">
			<p class="radar-feature-label">{{ en ? '🔥 FEATURED' : '🔥 本期焦点' }}</p>
			<div class="radar-feature-main">
				<h3 class="radar-feature-title">{{ en ? featured.titleEn : featured.title }}</h3>
				<span class="radar-status" :data-status="featured.status">{{ statusLabel(featured) }}</span>
			</div>
			<p class="radar-feature-summary">{{ en ? featured.summaryEn : featured.summary }}</p>
			<dl class="radar-feature-grid">
				<div>
					<dt>{{ en ? 'Why now' : '为什么是现在' }}</dt>
					<dd>{{ en ? featured.whyNowEn : featured.whyNow }}</dd>
				</div>
				<div>
					<dt>{{ en ? 'Product shift' : '产品变化' }}</dt>
					<dd>{{ en ? featured.productShiftEn : featured.productShift }}</dd>
				</div>
				<div>
					<dt>{{ en ? 'My take' : '我的判断' }}</dt>
					<dd>{{ en ? featured.myTakeEn : featured.myTake }}</dd>
				</div>
			</dl>
			<p v-if="featured.watch" class="radar-feature-watch">
				{{ en ? 'Watching:' : '继续观察：' }}{{ en ? featured.watchEn : featured.watch }}
			</p>
			<div class="radar-feature-foot">
				<a class="radar-read-more" :href="withBase(`${base}/${featured.id}`)">
					{{ en ? 'Read the full analysis' : '阅读完整分析' }} <span aria-hidden="true">→</span>
				</a>
				<div v-if="featureChips.length" class="radar-chips">
					<span v-for="chip in featureChips" :key="chip" class="radar-chip">{{ chip }}</span>
				</div>
			</div>
		</article>

		<div class="radar-list">
			<article v-for="item in restItems" :key="item.id" class="radar-item" :class="`is-${item.status}`">
				<header class="radar-item-head">
					<div class="radar-item-title-wrap">
						<h3 class="radar-item-title">
							<a :href="withBase(`${base}/${item.id}`)">{{ en ? item.titleEn : item.title }}</a>
						</h3>
						<span class="radar-status" :data-status="item.status">{{ statusLabel(item) }}</span>
					</div>
					<p class="radar-item-meta">
						<time>{{ item.date }}</time>
						<span class="radar-score" :title="en ? 'Radar score, my weighted call' : 'Radar 评分，我的加权判断'">
							{{ en ? 'SCORE' : '评分' }} {{ item.score.toFixed(1) }}
						</span>
					</p>
				</header>
				<p class="radar-item-summary">{{ en ? item.summaryEn : item.summary }}</p>
				<dl class="radar-item-questions">
					<div>
						<dt>{{ en ? 'Why now' : '为什么是现在' }}</dt>
						<dd>{{ en ? item.whyNowEn : item.whyNow }}</dd>
					</div>
					<div>
						<dt>{{ en ? 'My take' : '我的判断' }}</dt>
						<dd>{{ en ? item.myTakeEn : item.myTake }}</dd>
					</div>
				</dl>
				<ul v-if="(en ? item.evidenceEn : item.evidence)?.length" class="radar-evidence">
					<li v-for="line in en ? item.evidenceEn : item.evidence" :key="line">{{ line }}</li>
				</ul>
				<div class="radar-item-foot">
					<span v-for="topic in item.topics" :key="topic" class="radar-topic">#{{ topic }}</span>
					<span v-if="item.relatedBuilds?.length" class="radar-build-link">
						{{ en ? '→ related build' : '→ 关联构建' }}
					</span>
				</div>
			</article>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { withBase } from "vitepress";
import {
	RADAR_KINDS,
	RADAR_STATUS_META,
	filterRadarItems,
	latestRadarDate,
	radarItems,
	sortRadarItems,
	type RadarItem,
	type RadarKindFilter,
} from "../utils/radarList";

const props = withDefaults(defineProps<{ locale?: "zh" | "en" }>(), { locale: "zh" });

const en = computed(() => props.locale === "en");
const base = computed(() => (en.value ? "/en/radar" : "/radar"));
const activeKind = ref<RadarKindFilter>("all");

const visibleItems = computed(() => sortRadarItems(filterRadarItems(radarItems, activeKind.value)));
const featured = computed(() => visibleItems.value.find(item => item.featured));
const restItems = computed(() => visibleItems.value.filter(item => !item.featured));

function countOf(kind: RadarKindFilter) {
	return kind === "all" ? radarItems.length : radarItems.filter(item => item.type === kind).length;
}

function statusLabel(item: RadarItem) {
	const meta = RADAR_STATUS_META[item.status];
	return `${meta.icon} ${en.value ? meta.labelEn : meta.label}`;
}

const featureChips = computed(() => {
	const item = featured.value;
	if (!item) return [];
	return [...(item.products ?? []), ...(item.companies ?? [])].slice(0, 6);
});

const updatedLabel = computed(() => {
	const date = latestRadarDate(radarItems);
	if (!date) return "";
	const [y, m, d] = date.split("-");
	return en.value ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1]} ${Number(d)}` : `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
});
</script>

<style scoped>
.radar-board {
	--radar-accent: var(--vp-c-brand-1);
}

.radar-head {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 14px 24px;
	margin-bottom: 28px;
}

.radar-updated {
	margin: 0;
	font-size: 12px;
	color: var(--vp-c-text-2);
}

.radar-updated time {
	font-family: var(--vp-font-family-mono);
	color: var(--vp-c-text-1);
}

.radar-count {
	margin-left: 14px;
	padding-left: 14px;
	border-left: 1px solid var(--vp-c-divider);
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	color: var(--vp-c-text-3);
}

.radar-tabs {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 8px;
}

.radar-tabs button {
	padding: 7px 14px;
	font-size: 13px;
	color: var(--vp-c-text-2);
	background: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	border-radius: 999px;
	cursor: pointer;
	transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

.radar-tabs button:hover {
	color: var(--vp-c-text-1);
	border-color: var(--vp-c-text-3);
}

.radar-tabs button.active {
	color: var(--vp-c-bg);
	background: var(--radar-accent);
	border-color: var(--radar-accent);
}

.radar-tab-count {
	margin-left: 5px;
	font-family: var(--vp-font-family-mono);
	font-size: 10px;
	opacity: 0.7;
}

.radar-featured {
	position: relative;
	padding: 26px 28px 24px;
	margin-bottom: 40px;
	background: color-mix(in srgb, var(--radar-accent) 5%, var(--vp-c-bg));
	border: 1px solid color-mix(in srgb, var(--radar-accent) 32%, var(--vp-c-divider));
	border-left: 3px solid var(--radar-accent);
	border-radius: 10px;
}

.radar-feature-label {
	margin: 0 0 14px;
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	letter-spacing: 0.12em;
	color: var(--radar-accent);
}

.radar-feature-main {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px 14px;
}

.radar-feature-title {
	margin: 0;
	font-size: 26px;
	font-weight: 600;
	letter-spacing: -0.02em;
}

.radar-feature-summary {
	margin: 12px 0 0;
	font-size: 15px;
	line-height: 1.8;
	color: var(--vp-c-text-1);
}

.radar-feature-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
	margin: 22px 0 0;
}

.radar-feature-grid dt,
.radar-item-questions dt {
	margin-bottom: 6px;
	font-family: var(--vp-font-family-mono);
	font-size: 10px;
	letter-spacing: 0.08em;
	color: var(--radar-accent);
}

.radar-feature-grid dd,
.radar-item-questions dd {
	margin: 0;
	font-size: 13px;
	line-height: 1.8;
	color: var(--vp-c-text-2);
}

.radar-feature-watch {
	margin: 20px 0 0;
	padding-top: 16px;
	border-top: 1px dashed var(--vp-c-divider);
	font-size: 13px;
	line-height: 1.8;
	color: var(--vp-c-text-2);
}

.radar-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 14px;
}

.radar-feature-foot {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 10px 20px;
	margin-top: 14px;
}

.radar-feature-foot .radar-chips {
	margin-top: 0;
}

.radar-read-more {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	font-weight: 550;
	color: var(--radar-accent);
	text-decoration: none;
}

.radar-read-more span {
	transition: transform 0.18s ease;
}

.radar-read-more:hover span {
	transform: translateX(3px);
}

.radar-chip {
	padding: 3px 10px;
	font-size: 11px;
	background: var(--vp-c-bg);
	border: 1px solid var(--vp-c-divider);
	border-radius: 999px;
	color: var(--vp-c-text-2);
}

.radar-list {
	display: grid;
	gap: 0;
}

.radar-item {
	padding: 26px 0;
	border-bottom: 1px dashed var(--vp-c-divider);
}

.radar-item-head {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: space-between;
	gap: 8px 20px;
}

.radar-item-title-wrap {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px 12px;
	min-width: 0;
}

.radar-item-title {
	margin: 0;
	font-size: 17px;
	font-weight: 600;
	letter-spacing: -0.01em;
}

.radar-item-title a {
	color: inherit;
	text-decoration: none;
}

.radar-item-title a:hover {
	color: var(--radar-accent);
}

.radar-status {
	padding: 2px 9px;
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

.radar-item-meta {
	display: flex;
	align-items: baseline;
	gap: 14px;
	margin: 0;
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	color: var(--vp-c-text-3);
}

.radar-score {
	color: var(--radar-accent);
}

.radar-item-summary {
	margin: 10px 0 0;
	font-size: 14px;
	line-height: 1.8;
	color: var(--vp-c-text-1);
}

.radar-item-questions {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
	gap: 18px 32px;
	margin: 16px 0 0;
}

.radar-evidence {
	margin: 14px 0 0;
	padding: 12px 18px;
	list-style: none;
	background: var(--vp-c-bg-soft);
	border-radius: 8px;
}

.radar-evidence li {
	position: relative;
	padding: 3px 0 3px 16px;
	font-size: 13px;
	line-height: 1.7;
	color: var(--vp-c-text-2);
}

.radar-evidence li::before {
	content: '→';
	position: absolute;
	left: 0;
	color: var(--radar-accent);
}

.radar-item-foot {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
}

.radar-topic {
	font-family: var(--vp-font-family-mono);
	font-size: 11px;
	color: var(--vp-c-text-3);
}

.radar-build-link {
	margin-left: auto;
	font-size: 11px;
	color: var(--radar-accent);
}

@media (max-width: 720px) {
	.radar-feature-grid {
		grid-template-columns: 1fr;
	}

	.radar-item-questions {
		grid-template-columns: 1fr;
	}

	.radar-item-head {
		flex-direction: column;
		align-items: flex-start;
	}

	.radar-build-link {
		margin-left: 0;
	}
}
</style>
