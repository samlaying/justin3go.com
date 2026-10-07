<template>
	<div class="profile-radar" data-reveal>
		<ol v-if="top.length">
			<li v-for="item in top" :key="item.id">
				<span class="radar-status-icon" :data-status="item.status" aria-hidden="true">{{ RADAR_STATUS_META[item.status].icon }}</span>
				<div>
					<a :href="withBase(en ? '/en/radar' : '/radar')">
						<strong>{{ en ? item.titleEn : item.title }}</strong>
					</a>
					<span class="radar-item-summary">{{ en ? item.summaryEn : item.summary }}</span>
				</div>
			</li>
		</ol>
		<div class="radar-links">
			<span class="radar-updated">{{ en ? 'Updated' : '更新于' }} {{ updatedLabel }}</span>
			<a class="radar-all-link" :href="withBase(en ? '/en/radar' : '/radar')">
				{{ en ? 'View all' : '查看全部' }} <span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { RADAR_STATUS_META, latestRadarDate, radarItems, topRadarItems } from "../utils/radarList";

const props = withDefaults(defineProps<{ locale?: "zh" | "en"; limit?: number }>(), {
	locale: "zh",
	limit: 3,
});

const en = computed(() => props.locale === "en");
const top = computed(() => topRadarItems(radarItems, props.limit));

const updatedLabel = computed(() => {
	const date = latestRadarDate(radarItems);
	if (!date) return "";
	const [, m, d] = date.split("-");
	return en.value ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1]} ${Number(d)}` : `${Number(m)} 月 ${Number(d)} 日`;
});
</script>

<style scoped>
.profile-radar ol { list-style: none; display: grid; gap: 24px; padding: 0; margin: 0; }
.profile-radar li { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 0 14px; }
.radar-status-icon { padding-top: 3px; font-size: 15px; line-height: 1.5; }
.radar-status-icon[data-status='cooling'] { opacity: .55; }
.profile-radar a { color: inherit; text-decoration: none; }
.profile-radar strong { font-size: 15px; line-height: 1.6; font-weight: 550; letter-spacing: -.01em; }
.profile-radar li > div > a:hover strong { color: var(--home-accent, var(--vp-c-brand-1)); }
.radar-item-summary { display: block; margin-top: 5px; font-size: 13px; line-height: 1.8; color: var(--vp-c-text-2); }
.radar-links { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 28px; margin-top: 32px; }
.radar-updated { font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
.radar-all-link { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--home-accent, var(--vp-c-brand-1)); }
.radar-all-link span { transition: transform .18s ease; }
.radar-all-link:hover span { transform: translateX(3px); }
@media (max-width: 640px) { .profile-radar li { grid-template-columns: 26px minmax(0, 1fr); gap: 0 10px; } }
</style>
