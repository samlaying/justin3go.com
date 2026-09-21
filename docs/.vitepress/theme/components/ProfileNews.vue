<template>
	<div class="profile-news" data-reveal>
		<ol v-if="topNews.length">
			<li v-for="item in topNews" :key="item.date + item.url">
				<time>{{ item.date.slice(5) }}</time>
				<div>
					<a :href="item.url" target="_blank" rel="noopener noreferrer">
						<strong>{{ item.title[locale] }}</strong><span class="news-arrow" aria-hidden="true">↗</span>
					</a>
					<span class="news-meta">{{ kindLabel(item.kind, locale) }} · {{ item.source }}</span>
					<p>{{ item.comment[locale] }}</p>
				</div>
			</li>
		</ol>
		<a class="news-all-link" :href="withBase(locale === 'en' ? '/en/news' : '/news')">
			{{ locale === 'en' ? 'View all' : '查看全部' }} <span aria-hidden="true">→</span>
		</a>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { news } from "../news";
import { sortNewsDesc, kindLabel } from "../utils/newsList";

const props = withDefaults(defineProps<{ locale?: "zh" | "en" }>(), {
	locale: "zh",
});

const topNews = computed(() => sortNewsDesc(news).slice(0, 6));
</script>

<style scoped>
.profile-news ol { list-style: none; display: grid; gap: 24px; padding: 0; margin: 0; }
.profile-news li { display: grid; grid-template-columns: 48px minmax(0, 1fr); gap: 0 20px; }
.profile-news time { padding-top: 5px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-2); white-space: nowrap; }
.profile-news li:first-child time { color: var(--home-accent, var(--vp-c-brand-1)); }
.profile-news a { color: inherit; text-decoration: none; }
.profile-news strong { font-size: 15px; line-height: 1.6; font-weight: 550; letter-spacing: -.01em; }
.news-arrow { display: inline-block; margin-left: 6px; font-size: 12px; color: var(--vp-c-text-3); transition: transform .18s ease, color .18s ease; }
.profile-news li > div > a:hover strong { color: var(--home-accent, var(--vp-c-brand-1)); }
.profile-news li > div > a:hover .news-arrow { color: var(--home-accent, var(--vp-c-brand-1)); transform: translate(2px, -2px); }
.news-meta { display: block; margin-top: 5px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
.profile-news p { margin: 7px 0 0; font-size: 13px; line-height: 1.8; color: var(--vp-c-text-2); }
.news-all-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 32px; font-size: 13px; color: var(--home-accent, var(--vp-c-brand-1)); }
.news-all-link span { transition: transform .18s ease; }
.news-all-link:hover span { transform: translateX(3px); }
@media (max-width: 640px) { .profile-news li { grid-template-columns: 40px minmax(0, 1fr); gap: 0 12px; } }
</style>
