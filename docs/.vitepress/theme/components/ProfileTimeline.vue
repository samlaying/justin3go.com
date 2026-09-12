<template>
	<ol class="profile-timeline">
		<li v-for="(item, index) in items" :key="item.time" :class="{ current: index === 0 }">
			<span class="timeline-dot" aria-hidden="true"></span>
			<time>{{ item.time }}</time>
			<div>
				<strong>{{ item.title }}</strong>
				<p>{{ item.description }}</p>
			</div>
		</li>
	</ol>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{ locale?: "zh" | "en" }>(), {
	locale: "zh",
});

const zhItems = [
	{ time: "2004", title: "故事开始", description: "出生。从这里开始，慢慢认识世界。" },
	{ time: "2023 — 2027", title: "经济学", description: "本科就读经济学。" },
	{ time: "2025.09 — 至今", title: "AI 产品经理实习", description: "走进真实业务，学习团队协作与产品交付。" },
];

const enItems = [
	{ time: "2004", title: "The story begins", description: "Born. The start of a lifelong curiosity about the world." },
	{ time: "2023 — 2027", title: "Economics", description: "Studied Economics as an undergraduate." },
	{ time: "2025.09 — Present", title: "AI product manager intern", description: "Joined a real product team and learned how to collaborate and ship." },
];

const items = computed(() => [...(props.locale === "en" ? enItems : zhItems)].reverse());
</script>

<style scoped>
.profile-timeline { list-style: none; padding: 0; margin: 0; }
.profile-timeline li { position: relative; margin: 0; padding: 0 0 30px 28px; border-left: 1px solid var(--vp-c-divider); }
.profile-timeline li:last-child { padding-bottom: 0; border-left-color: transparent; }
.timeline-dot { position: absolute; left: -4px; top: 5px; width: 7px; height: 7px; border: 1px solid var(--vp-c-text-3); border-radius: 50%; background: var(--vp-c-bg); }
.current .timeline-dot { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 4px var(--vp-c-brand-soft); }
.profile-timeline time { display: block; margin-bottom: 8px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-2); }
.current time { color: var(--vp-c-brand-1); }
.profile-timeline strong { font-size: 15px; line-height: 1.6; font-weight: 550; }
.profile-timeline p { margin: 7px 0 0; font-size: 13px; line-height: 1.8; color: var(--vp-c-text-2); }
@media (max-width: 640px) { .profile-timeline li { padding-left: 25px; } }
</style>
