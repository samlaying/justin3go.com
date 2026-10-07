import assert from 'node:assert/strict'
import test from 'node:test'
import { BLOG_TYPES, filterPosts, getPage, getType, inferBlogType, paginatePosts } from '../docs/.vitepress/theme/utils/blogFilters.ts'

const posts = [
  { title: 'Product', type: 'product-analysis', date: { time: 3 } },
  { title: 'AI', type: 'ai-practice', date: { time: 2 } },
  { title: 'Legacy', date: { time: 1 } },
]

test('defines the six supported blog content types', () => {
  assert.deepEqual(BLOG_TYPES.filter(item => item.value !== 'all').map(item => item.value), [
    'competitor-analysis', 'product-analysis', 'ai-practice', 'tech-learning', 'code', 'llm-paper',
  ])
})

test('filters known types while keeping legacy posts in all', () => {
  assert.equal(filterPosts(posts, 'all').length, 3)
  assert.deepEqual(filterPosts(posts, 'ai-practice').map(post => post.title), ['AI'])
  assert.deepEqual(filterPosts(posts, 'unknown').map(post => post.title), ['Product', 'AI', 'Legacy'])
})

test('normalises invalid query values and page bounds', () => {
  assert.equal(getType({ type: 'code' }), 'code')
  assert.equal(getType({ type: 'nope' }), 'all')
  assert.equal(getPage({ page: '3' }, 2), 2)
  assert.equal(getPage({ page: '-1' }, 2), 1)
  assert.equal(getPage({}, 2), 1)
})

test('paginates filtered posts and reports total pages', () => {
  assert.deepEqual(paginatePosts(posts, 1, 2), { items: posts.slice(0, 2), total: 3, totalPages: 2 })
  assert.deepEqual(paginatePosts(posts, 9, 2), { items: [posts[2]], total: 3, totalPages: 2 })
})

test('infers legacy article types conservatively from explicit metadata and signals', () => {
  assert.equal(inferBlogType({ type: 'code', title: 'Anything', tags: [] }), 'code')
  assert.equal(inferBlogType({ title: 'HUNT0 上线了', tags: ['Product', 'Launch'] }), 'product-analysis')
  assert.equal(inferBlogType({ title: '我把 Harness Engineering 提炼成了 SKILL', tags: ['Prompt Engineering', 'Skill'] }), 'ai-practice')
  assert.equal(inferBlogType({ title: '一篇普通随笔', tags: [] }), undefined)
})

test('routes competitor signals to competitor-analysis, ahead of product-analysis', () => {
  assert.equal(inferBlogType({ type: 'competitor-analysis', title: 'Anything', tags: [] }), 'competitor-analysis')
  assert.equal(inferBlogType({ title: '五款 AI 个人助理竞品横评', tags: [] }), 'competitor-analysis')
  assert.equal(inferBlogType({ title: 'Notion vs Obsidian', tags: ['Competitor'] }), 'competitor-analysis')
  // 「产品」这个宽类不能被竞品规则吃光：没有竞品信号的仍归产品分析
  assert.equal(inferBlogType({ title: 'HUNT0 产品复盘', tags: [] }), 'product-analysis')
  assert.equal(inferBlogType({ title: '产品设计随想', tags: [] }), 'product-analysis')
})
