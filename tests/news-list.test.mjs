import assert from 'node:assert/strict'
import test from 'node:test'
import { news } from '../docs/.vitepress/theme/news.ts'
import { groupNewsByMonth, kindLabel, monthLabel, sortNewsDesc } from '../docs/.vitepress/theme/utils/newsList.ts'

const items = [
  { date: '2026-09-01', title: { zh: '旧', en: 'Old' }, comment: { zh: '', en: '' }, url: 'https://a.com/1', source: 'A', kind: 'model' },
  { date: '2026-09-21', title: { zh: '新', en: 'New' }, comment: { zh: '', en: '' }, url: 'https://a.com/2', source: 'A', kind: 'product' },
  { date: '2026-08-15', title: { zh: '更旧', en: 'Older' }, comment: { zh: '', en: '' }, url: 'https://a.com/3', source: 'B', kind: 'industry' },
]

test('sorts news by date descending regardless of input order', () => {
  assert.deepEqual(sortNewsDesc([items[0], items[2], items[1]]).map(item => item.date), ['2026-09-21', '2026-09-01', '2026-08-15'])
  // 不改变原数组
  assert.equal(items[0].date, '2026-09-01')
})

test('groups news by month in descending order', () => {
  const groups = groupNewsByMonth(items)
  assert.deepEqual(groups.map(([month]) => month), ['2026-09', '2026-08'])
  assert.equal(groups[0][1].length, 2)
  assert.deepEqual(groups[0][1].map(item => item.date), ['2026-09-21', '2026-09-01'])
})

test('maps kind and month labels for both locales', () => {
  assert.equal(kindLabel('model', 'zh'), '模型')
  assert.equal(kindLabel('model', 'en'), 'Model')
  assert.equal(kindLabel('product', 'en'), 'Product')
  assert.equal(kindLabel('industry', 'en'), 'Industry')
  assert.equal(monthLabel('2026-09', 'zh'), '2026 年 9 月')
  assert.equal(monthLabel('2026-09', 'en'), 'Sep 2026')
  assert.equal(monthLabel('2026-01', 'en'), 'Jan 2026')
})

test('seed data stays valid: descending dates, https urls, both locales filled', () => {
  assert.ok(news.length >= 5)
  const dates = news.map(item => item.date)
  const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
  assert.deepEqual(dates, sorted)
  for (const item of news) {
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.match(item.url, /^https:\/\//)
    assert.ok(item.title.zh && item.title.en)
    assert.ok(item.comment.zh && item.comment.en)
    assert.ok(['model', 'product', 'industry'].includes(item.kind))
  }
  // 无重复 url
  assert.equal(new Set(news.map(item => item.url)).size, news.length)
})
