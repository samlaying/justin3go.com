import assert from 'node:assert/strict'
import test from 'node:test'
import {
  RADAR_KINDS,
  RADAR_STATUSES,
  RADAR_STATUS_META,
  filterRadarItems,
  latestRadarDate,
  radarItems,
  sortRadarItems,
  topRadarItems,
} from '../docs/.vitepress/theme/utils/radarList.ts'

test('every mock entry passes the data contract', () => {
  assert.ok(radarItems.length >= 5, 'radar needs a real board, not a placeholder')
  const ids = new Set()
  for (const item of radarItems) {
    assert.ok(!ids.has(item.id), `duplicate id "${item.id}"`)
    ids.add(item.id)
    assert.ok(RADAR_KINDS.some(kind => kind.value === item.type), `item "${item.id}" has unknown type`)
    assert.ok(RADAR_STATUSES.includes(item.status), `item "${item.id}" has unknown status`)
    assert.ok(item.score >= 1 && item.score <= 5, `item "${item.id}" score out of 1–5`)
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/, `item "${item.id}" date must be YYYY-MM-DD`)
    // 双语字段必须成对出现：看板组件直接按 locale 取，缺一个就漏内容
    for (const key of ['title', 'summary', 'whyNow', 'capabilityShift', 'productShift', 'realUseCase', 'failure', 'myTake']) {
      assert.ok(item[key], `item "${item.id}" missing zh ${key}`)
      assert.ok(item[`${key}En`], `item "${item.id}" missing en ${key}En`)
    }
    if (item.watch) assert.ok(item.watchEn, `item "${item.id}" has watch but no watchEn`)
    if (item.evidence) assert.ok(item.evidenceEn?.length === item.evidence.length, `item "${item.id}" evidence pairs mismatch`)
  }
})

test('at most one featured item exists', () => {
  assert.ok(radarItems.filter(item => item.featured).length <= 1)
})

test('each status has complete metadata for both locales', () => {
  for (const status of RADAR_STATUSES) {
    const meta = RADAR_STATUS_META[status]
    assert.ok(meta?.label && meta.labelEn && meta.icon, `status "${status}" metadata incomplete`)
  }
})

test('filterRadarItems keeps only the kind and never mutates input', () => {
  const products = filterRadarItems(radarItems, 'product')
  const tech = filterRadarItems(radarItems, 'technology')
  const signals = filterRadarItems(radarItems, 'signal')
  assert.ok(products.length > 0 && tech.length > 0 && signals.length > 0, 'all three kinds should have entries')
  assert.ok(products.every(item => item.type === 'product'))
  assert.ok(tech.every(item => item.type === 'technology'))
  assert.ok(signals.every(item => item.type === 'signal'))
  assert.deepEqual(filterRadarItems(radarItems, 'all'), radarItems, 'all returns same entries')
  assert.notEqual(filterRadarItems(radarItems, 'all'), radarItems, 'but as a new array')
  assert.equal(radarItems.length, products.length + tech.length + signals.length)
})

test('sortRadarItems orders by date desc, score desc on ties', () => {
  const shuffled = [
    { date: '2026-09-01', score: 5 },
    { date: '2026-10-07', score: 1 },
    { date: '2026-10-07', score: 4 },
    { date: '2026-10-01', score: 3 },
  ]
  const sorted = sortRadarItems(shuffled)
  assert.deepEqual(sorted.map(item => item.date), ['2026-10-07', '2026-10-07', '2026-10-01', '2026-09-01'])
  assert.deepEqual(sorted.slice(0, 2).map(item => item.score), [4, 1])
  assert.equal(shuffled[0].date, '2026-09-01', 'must not mutate input')
})

test('latestRadarDate takes the max across all items', () => {
  assert.equal(latestRadarDate([{ date: '2026-09-01' }, { date: '2026-10-07' }, { date: '2026-09-30' }]), '2026-10-07')
  assert.equal(latestRadarDate([]), '')
  assert.equal(latestRadarDate(radarItems), '2026-10-07')
})

test('topRadarItems picks by score desc then date desc, bounded by limit', () => {
  const items = [
    { date: '2026-09-01', score: 4.5 },
    { date: '2026-10-07', score: 5 },
    { date: '2026-10-05', score: 4.5 },
    { date: '2026-08-01', score: 3 },
  ]
  const top = topRadarItems(items, 3)
  assert.deepEqual(top.map(item => item.score), [5, 4.5, 4.5])
  assert.equal(top[1].date, '2026-10-05', 'tie broken by newer date')
  assert.ok(topRadarItems(items, 99).length <= 4)
})
