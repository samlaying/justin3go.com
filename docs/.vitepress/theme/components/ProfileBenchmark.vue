<template>
	<div class="profile-benchmark" data-reveal>
		<ol v-if="top.length">
			<li v-for="post in top" :key="post.url">
				<time>{{ post.date.monthDay }}</time>
				<div>
					<a :href="withBase(post.url)">
						<strong>{{ post.title }}</strong><span class="benchmark-arrow" aria-hidden="true">↗</span>
					</a>
					<span v-if="post.tags?.length" class="benchmark-meta">{{ post.tags.slice(0, 3).join(' · ') }}</span>
					<div v-if="post.excerpt" class="benchmark-excerpt" v-html="post.excerpt"></div>
				</div>
			</li>
		</ol>
		<div class="benchmark-links">
			<a class="benchmark-all-link" :href="withBase(en ? '/en/benchmark' : '/benchmark')">
				{{ en ? 'View all' : '进入专栏' }} <span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { data as postsZh } from "../posts.data.mts";
import { data as postsEn } from "../posts-en.data.mts";
import { selectBenchmarkPosts } from "../utils/benchmarkList";

const props = withDefaults(defineProps<{ locale?: "zh" | "en"; limit?: number }>(), {
	locale: "zh",
	limit: 3,
});

const en = computed(() => props.locale === "en");
// 竞品分析文章就是普通博客文章，按 type 过滤即可——这里和 /benchmark 用同一份数据
const top = computed(() => selectBenchmarkPosts(en.value ? postsEn : postsZh).slice(0, props.limit));
</script>

<style scoped>
.profile-benchmark ol { list-style: none; display: grid; gap: 24px; padding: 0; margin: 0; }
.profile-benchmark li { display: grid; grid-template-columns: 48px minmax(0, 1fr); gap: 0 20px; }
.profile-benchmark time { padding-top: 5px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-2); white-space: nowrap; }
.profile-benchmark li:first-child time { color: var(--home-accent, var(--vp-c-brand-1)); }
.profile-benchmark a { color: inherit; text-decoration: none; }
.profile-benchmark strong { font-size: 15px; line-height: 1.6; font-weight: 550; letter-spacing: -.01em; }
.benchmark-arrow { display: inline-block; margin-left: 6px; font-size: 12px; color: var(--vp-c-text-3); transition: transform .18s ease, color .18s ease; }
.profile-benchmark li > div > a:hover strong { color: var(--home-accent, var(--vp-c-brand-1)); }
.profile-benchmark li > div > a:hover .benchmark-arrow { color: var(--home-accent, var(--vp-c-brand-1)); transform: translate(2px, -2px); }
.benchmark-meta { display: block; margin-top: 5px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-3); }
/* 摘要原文是块级 HTML（来自 DESC SEP 之后的内容），所以用 div 承载，并夹到三行保持首页节奏 */
.benchmark-excerpt { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-top: 7px; font-size: 13px; line-height: 1.8; color: var(--vp-c-text-2); }
.benchmark-excerpt :deep(p), .benchmark-excerpt :deep(blockquote) { margin: 0; border: 0; padding: 0; font-size: inherit; color: inherit; }
.benchmark-links { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 32px; }
.benchmark-all-link { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--home-accent, var(--vp-c-brand-1)); }
.benchmark-all-link span { transition: transform .18s ease; }
.benchmark-all-link:hover span { transform: translateX(3px); }
@media (max-width: 640px) { .profile-benchmark li { grid-template-columns: 40px minmax(0, 1fr); gap: 0 12px; } }
</style>
