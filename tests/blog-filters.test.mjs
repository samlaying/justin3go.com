import assert from 'node:assert/strict'
import test from 'node:test'
import { BLOG_TYPES, filterPosts, getPage, getType, inferBlogType, paginatePosts } from '../docs/.vitepress/theme/utils/blogFilters.ts'

const posts = [
  { title: 'Product', type: 'product-analysis', date: { time: 3 } },
  { title: 'AI', type: 'ai-practice', date: { time: 2 } },
  { title: 'Legacy', date: { time: 1 } },
]

test('defines the five supported blog content types', () => {
  assert.deepEqual(BLOG_TYPES.filter(item => item.value !== 'all').map(item => item.value), [
    'product-analysis', 'ai-practice', 'tech-learning', 'code', 'llm-paper',
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
