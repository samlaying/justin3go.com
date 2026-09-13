---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: Blog
description: sam's blog on product analysis, AI practice, technical learning, code, and LLM papers.
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
---

<!-- 之所以将代码写在 md 里面，而非单独封装为 Vue 组件，因为 aside 不会动态刷新，参考 https://github.com/vuejs/vitepress/issues/2686 -->
<nav class="blog-filters" aria-label="Blog categories">
  <a v-for="item in BLOG_TYPES" :key="item.value" :href="filterUrl(item.value)" :aria-current="selectedType === item.value ? 'page' : undefined">
    {{ item.labelEn }}
  </a>
</nav>
<template v-for="post in curPosts" :key="post.url">
  <h2 :id="post.title" class="post-title">
    <a :href="post.url">{{ post.title }}</a>
    <a
      class="header-anchor"
      :href="`#${post.title}`"
      :aria-label="`Permalink to &quot;${post.title}&quot;`"
      >​</a
    >
    <div class="post-date hollow-text source-han-serif">{{ post.date.string }}</div>
  </h2>
  <t-tag
    v-for="tag in post.tags"
    class="mr-2"
    variant="outline"
    shape="round"
    >{{ tag }}</t-tag
  >
  <div v-if="post.excerpt" v-html="post.excerpt"></div>
</template>

<!-- <Pagination /> -->
<div class="pagination-container">
  <t-config-provider :global-config="enConfig">
    <t-pagination
      v-model="current"
      v-model:pageSize="pageSize"
      :total="total"
      size="small"
      :showPageSize="false"
      :showPageNumber="!isMobile()"
      :showJumper="isMobile()"
      @current-change="onCurrentChange"
    />
  </t-config-provider>
</div>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vitepress";
// 非 Vue 组件需要手动引入
import {
	PaginationProps,
	Pagination as TPagination,
  Tag as TTag,
  ConfigProvider as TConfigProvider,
} from "tdesign-vue-next";
import enConfig from 'tdesign-vue-next/es/locale/en_US';

import { data as posts } from "../.vitepress/theme/posts-en.data.mts";
import { isMobile } from "../.vitepress/theme/utils/mobile.ts";
import { BLOG_TYPES, filterPosts, getPage, getType, paginatePosts } from "../.vitepress/theme/utils/blogFilters.ts";

const route = useRoute();

const current = ref(1)
const pageSize = ref(10);
const selectedType = computed(() => getType(route.query as Record<string, unknown>));
const filteredPosts = computed(() => filterPosts(posts, selectedType.value));
const totalPages = computed(() => paginatePosts(filteredPosts.value, 1, pageSize.value).totalPages);
const total = computed(() => filteredPosts.value.length);

// 在首页有page参数时，从NAV跳转到当前页，清空了参数，但没有刷新页面内容的问题，需要手动更新current
watch([() => route.query.page, () => route.query.type, totalPages], () => {
  current.value = getPage(route.query as Record<string, unknown>, totalPages.value);
}, { immediate: true });

const curPosts = computed(() => {
  return paginatePosts(filteredPosts.value, current.value, pageSize.value).items;
});

function filterUrl(type: string) {
  const url = new URL(route.path, 'https://blog.invalid');
  for (const [key, value] of Object.entries(route.query)) {
    if (key !== 'type' && key !== 'page') {
      for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
    }
  }
  if (type === 'all') url.searchParams.delete('type');
  else url.searchParams.set('type', type);
  url.searchParams.delete('page');
  return `${url.pathname}${url.search}`;
}

const onCurrentChange: PaginationProps["onCurrentChange"] = (
	index,
	pageInfo
) => {
	// MessagePlugin.success(`Go to page ${index}`);

	const url = new URL(window.location as any);
	if (selectedType.value === 'all') url.searchParams.delete('type');
	else url.searchParams.set('type', selectedType.value);
	url.searchParams.set("page", index.toString());
	window.history.replaceState({}, "", url);

	window.scrollTo({
		top: 0,
	});
};
</script>
<style lang="scss" scoped>
/* 去掉.vp-doc li + li 的 margin-top */
.pagination-container {
	margin-top: 60px;

	:deep(li) {
		margin-top: 0px;
	}
}

.blog-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin: 24px 0 8px;
}

.blog-filters a {
	padding: 6px 12px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 999px;
	color: var(--vp-c-text-2);
	font-size: 13px;
	text-decoration: none;
}

.blog-filters a:hover,
.blog-filters a[aria-current="page"] {
	border-color: var(--vp-c-brand-1);
	color: var(--vp-c-brand-1);
}

.mr-2 {
	margin-right: 2px;
}

.post-title {
	margin-bottom: 6px;
  margin-top: 60px;
	border-top: 0px;
	position: relative;
	top: 0;
	left: 0;

  > a {
		font-weight: 400;
	}

	.post-date {
		position: absolute;
		top: -12px;
		left: -10px;

		z-index: -1;
		opacity: .16;
		font-size: 76px;
		font-weight: 900;
	}

	@media (max-width: 425px) {
		.post-date {
			font-size: 60px !important;
		}
	}

  &:first-child {
		margin-top: 20px;
	}
}

.hollow-text {

  /* 设置文本颜色为透明 */
  color: var(--vp-c-bg);

	-webkit-text-stroke: 1px var(--vp-c-text-1);
}
</style>
