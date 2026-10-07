import assert from 'node:assert/strict'
import test from 'node:test'
import { BENCHMARK_TYPE, groupByYear, selectBenchmarkPosts } from '../docs/.vitepress/theme/utils/benchmarkList.ts'
import { BLOG_TYPES, inferBlogType } from '../docs/.vitepress/theme/utils/blogFilters.ts'

const post = (type, year, title) => ({ type, title, date: { year } })

const posts = [
  post('competitor-analysis', '2026', 'A'),
  post('product-analysis', '2026', 'B'),
  post('competitor-analysis', '2025', 'C'),
  { title: 'D', date: { year: '2025' } }, // legacy post, no type
]

test('selects only competitor-analysis posts and preserves input order', () => {
  assert.deepEqual(selectBenchmarkPosts(posts).map(item => item.title), ['A', 'C'])
  assert.equal(posts.length, 4, 'must not mutate input')
})

test('BENCHMARK_TYPE is a registered blog type and round-trips through inference', () => {
  assert.ok(
    BLOG_TYPES.some(item => item.value === BENCHMARK_TYPE),
    `BENCHMARK_TYPE "${BENCHMARK_TYPE}" is not registered in BLOG_TYPES`
  )
  assert.equal(inferBlogType({ type: BENCHMARK_TYPE, title: 'Anything', tags: [] }), BENCHMARK_TYPE)
})

test('groups by year descending and keeps order inside a year', () => {
  const groups = groupByYear(selectBenchmarkPosts(posts))
  assert.deepEqual(groups.map(([year]) => year), ['2026', '2025'])
  assert.deepEqual(groups[0][1].map(item => item.title), ['A'])
  assert.deepEqual(groups[1][1].map(item => item.title), ['C'])
})

test('sorts years itself rather than trusting input order', () => {
  const shuffled = [post('competitor-analysis', '2024', 'old'), post('competitor-analysis', '2026', 'new')]
  assert.deepEqual(groupByYear(shuffled).map(([year]) => year), ['2026', '2024'])
})

test('empty input yields no groups', () => {
  assert.deepEqual(groupByYear([]), [])
  assert.deepEqual(selectBenchmarkPosts([]), [])
})
