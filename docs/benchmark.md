---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: 竞品分析
description: 同一套标准，横向跑不同产品：不吹不黑，只记谁真正解决了问题。
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
---

同一个问题，交给不同产品，看它们各自怎么解——这是这个专栏唯一的方法。

不写「某某真强大」这种句子。写的是：同一道题、同一批素材、同一套评判维度，谁答得出来、谁答得漂亮、谁在装。多数竞品分析的通病是拿各家的宣传语互相比较，这里只比可复现的东西。

**判断维度**（每篇按需取用，不强行凑满）：场景嵌入度、交互流动感、克制与信息密度、交付闭环度、记忆与资产沉淀。

<div v-if="!curPosts.length" class="benchmark-empty">
  <p>专栏已就绪，第一篇分析正在写。</p>
  <p class="benchmark-empty-hint">在那之前，可以先看看我在做的其他记录。</p>
</div>

<!-- 与 blog.md 同理，列表写在 md 里而非 Vue 组件（aside 不会动态刷新） -->
<template v-for="[year, group] in yearGroups" :key="year">
  <h2 :id="year" class="benchmark-year">{{ year }}</h2>
  <article v-for="post in group" :key="post.url" class="benchmark-row">
    <time>{{ post.date.monthDay }}</time>
    <div>
      <a class="benchmark-title" :href="post.url">{{ post.title }}</a>
      <span class="benchmark-tags">
        <t-tag v-for="tag in post.tags" :key="tag" variant="outline" shape="round" size="small">{{ tag }}</t-tag>
      </span>
      <div v-if="post.excerpt" class="benchmark-excerpt" v-html="post.excerpt"></div>
    </div>
  </article>
</template>

<h2 class="benchmark-more-title">相关栏目</h2>

<div class="benchmark-more">
  <a class="more-card" href="/news">
    <span class="more-name">AI 动态</span>
    <span class="more-desc">模型发布与产品更新，附一句话点评</span>
  </a>
  <a class="more-card" href="/arena">
    <span class="more-name">模型竞技场</span>
    <span class="more-desc">固定题库，多模型逐字对答，无评分</span>
  </a>
  <a class="more-card" href="/products">
    <span class="more-name">产品体验</span>
    <span class="more-desc">上手过的产品，按时间倒序记录</span>
  </a>
</div>

<script lang="ts" setup>
import { computed } from "vue";
import { data as posts } from "./.vitepress/theme/posts.data.mts";
import { selectBenchmarkPosts, groupByYear } from "./.vitepress/theme/utils/benchmarkList.ts";

const curPosts = computed(() => selectBenchmarkPosts(posts));
const yearGroups = computed(() => groupByYear(curPosts.value));
</script>

<style lang="scss" scoped>
.benchmark-empty {
  margin: 40px 0;
  padding: 26px 28px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;

  p {
    margin: 0;
    font-size: 15px;
  }

  .benchmark-empty-hint {
    margin-top: 8px;
    font-size: 13px;
    color: var(--vp-c-text-2);
  }
}

.benchmark-year {
  margin-top: 60px;
  font-size: 22px;
  font-weight: 550;
  border-top: 0;

  &:first-of-type {
    margin-top: 20px;
  }
}

.benchmark-row {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 0 20px;
  padding: 22px 0;
  border-bottom: 1px dashed var(--vp-c-divider);

  time {
    padding-top: 4px;
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    color: var(--vp-c-text-2);
  }

  .benchmark-title {
    font-size: 16px;
    font-weight: 550;
    color: inherit;
    text-decoration: none;

    &:hover {
      color: var(--vp-c-brand-1);
    }
  }

  .benchmark-tags {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-left: 10px;
    vertical-align: middle;
  }

  .benchmark-excerpt {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.8;
    color: var(--vp-c-text-2);

    :deep(p) {
      margin: 0 0 6px;
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: 74px minmax(0, 1fr);
    gap: 0 12px;

    .benchmark-tags {
      margin-left: 0;
      margin-top: 6px;
    }
  }
}

.benchmark-more-title {
  margin-top: 70px;
  font-size: 18px;
  font-weight: 550;
  border-top: 0;
}

.benchmark-more {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.more-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  transition: border-color 0.25s;

  &:hover {
    border-color: var(--vp-c-brand-1);
  }

  .more-name {
    font-size: 14px;
    font-weight: 550;
  }

  .more-desc {
    font-size: 12px;
    line-height: 1.7;
    color: var(--vp-c-text-3);
  }
}
</style>
