import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { products } from '../docs/.vitepress/theme/products.ts'
import { categoryLabel, groupProductsByMonth, kindLabel, sortProductsDesc } from '../docs/.vitepress/theme/utils/productList.ts'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const articlesDir = path.join(repoRoot, 'docs', 'products')

const entries = [
  { date: '2026-09-01', product: 'A', url: 'https://a.com', category: 'chat', kind: 'watch', note: { zh: 'x', en: 'x' } },
  { date: '2026-09-21', product: 'B', url: 'https://b.com', category: 'coding', kind: 'experience', note: { zh: 'x', en: 'x' } },
  { date: '2026-08-15', product: 'A', url: 'https://a.com', category: 'chat', kind: 'experience', note: { zh: 'x', en: 'x' } },
]

test('sorts product entries by date descending without mutating input', () => {
  assert.deepEqual(sortProductsDesc([entries[0], entries[2], entries[1]]).map(item => item.date), ['2026-09-21', '2026-09-01', '2026-08-15'])
  assert.equal(entries[0].date, '2026-09-01')
})

test('groups entries by month descending, same product may repeat', () => {
  const groups = groupProductsByMonth(entries)
  assert.deepEqual(groups.map(([month]) => month), ['2026-09', '2026-08'])
  assert.equal(groups[0][1].length, 2)
  assert.equal(new Set(groups.flatMap(([, items]) => items.map(item => item.product))).size, 2)
})

test('maps category and kind labels for both locales', () => {
  assert.equal(categoryLabel('chat', 'zh'), '对话助手')
  assert.equal(categoryLabel('chat', 'en'), 'Chat')
  assert.equal(categoryLabel('search', 'en'), 'Search')
  assert.equal(kindLabel('experience', 'zh'), '体验')
  assert.equal(kindLabel('experience', 'en'), 'Experienced')
  assert.equal(kindLabel('watch', 'en'), 'Watching')
})

test('seed data stays valid: descending dates, https urls, enums, bilingual notes, no dupes', () => {
  assert.ok(products.length >= 5)
  const dates = products.map(item => item.date)
  assert.deepEqual(dates, [...dates].sort((a, b) => (a < b ? 1 : -1)))
  const seen = new Set()
  for (const item of products) {
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.match(item.url, /^https:\/\//)
    assert.ok(item.product && item.note.zh && item.note.en)
    assert.ok(['experience', 'watch'].includes(item.kind))
    assert.ok(['chat', 'coding', 'image', 'video', 'audio', 'agent', 'search', 'other'].includes(item.category))
    const key = `${item.date}+${item.product}+${item.kind}`
    assert.ok(!seen.has(key), `duplicate date+product+kind: ${key}`)
    seen.add(key)
    if (item.slug) {
      assert.match(item.slug, /^[a-z0-9-]+$/)
      assert.equal(item.kind, 'experience', 'slug only allowed on experience entries')
      assert.ok(existsSync(path.join(articlesDir, `${item.slug}.md`)), `missing article for slug: ${item.slug}`)
    }
  }
})

test('every product article on disk is referenced by at least one entry slug', () => {
  if (!existsSync(articlesDir)) return
  const referenced = new Set(products.filter(item => item.slug).map(item => item.slug))
  for (const file of readdirSync(articlesDir)) {
    if (!file.endsWith('.md')) continue
    const slug = file.replace(/\.md$/, '')
    assert.ok(referenced.has(slug), `orphan article not referenced by any entry: ${file}`)
  }
})
