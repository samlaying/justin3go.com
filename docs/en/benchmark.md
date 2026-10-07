---
# https://vitepress.dev/reference/default-theme-home-page
layout: doc
title: Competitor Analysis
description: "Same standard, run across different products: no hype, just who actually solved the problem."
editLink: false
lastUpdated: false
isNoComment: true
isNoBackBtn: true
---

One problem, handed to several products, watching how each of them solves it. That is the only method this column has.

No "X is so powerful" sentences. What gets written down: the same task, the same material, the same set of judging dimensions — who can answer, who answers well, and who is bluffing. Most competitor analysis compares marketing copy against marketing copy; here only reproducible things get compared.

**Dimensions** (used as needed per piece, never padded to fill): embeddedness, flow and momentum, restraint and information density, actionability, memory and grounding.

<div v-if="!curPosts.length" class="benchmark-empty">
  <p>The column is wired up. The first analysis is being written.</p>
  <p class="benchmark-empty-hint">Meanwhile, here is what else I keep track of.</p>
</div>

<!-- Same as blog.md: the list lives in the md file, not a Vue component (aside doesn't refresh dynamically) -->
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

<h2 class="benchmark-more-title">More from the lab</h2>

<div class="benchmark-more">
  <a class="more-card" href="/en/news">
    <span class="more-name">AI News</span>
    <span class="more-desc">Model releases and product updates, each with a one-line take</span>
  </a>
  <a class="more-card" href="/en/arena">
    <span class="more-name">Model Arena</span>
    <span class="more-desc">A fixed prompt suite, verbatim answers, no scoring</span>
  </a>
  <a class="more-card" href="/en/products">
    <span class="more-name">Products</span>
    <span class="more-desc">Products I've tried, newest first</span>
  </a>
</div>

<script lang="ts" setup>
import { computed } from "vue";
import { data as posts } from "../.vitepress/theme/posts-en.data.mts";
import { selectBenchmarkPosts, groupByYear } from "../.vitepress/theme/utils/benchmarkList.ts";

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
