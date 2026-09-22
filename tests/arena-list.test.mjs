import assert from 'node:assert/strict'
import test from 'node:test'
import { arenaPrompts, arenaRounds } from '../docs/.vitepress/theme/arena.ts'
import { categoryLabel, findPrompt, sortRoundsDesc, sourceLabel } from '../docs/.vitepress/theme/utils/arenaList.ts'

const rounds = [
  { date: '2026-09-01', promptId: 'math-pool', answers: [], verdict: { zh: '', en: '' } },
  { date: '2026-09-21', promptId: 'logic-vase', answers: [], verdict: { zh: '', en: '' } },
  { date: '2026-08-15', promptId: 'logic-vase', answers: [], verdict: { zh: '', en: '' } },
]

test('sorts rounds by date descending without mutating input', () => {
  assert.deepEqual(sortRoundsDesc([rounds[0], rounds[2], rounds[1]]).map(round => round.date), ['2026-09-21', '2026-09-01', '2026-08-15'])
  assert.equal(rounds[0].date, '2026-09-01')
})

test('finds prompts by id and returns undefined on miss', () => {
  assert.equal(findPrompt(arenaPrompts, 'logic-vase')?.category, 'logic')
  assert.equal(findPrompt(arenaPrompts, 'nope'), undefined)
})

test('maps category and source labels for both locales', () => {
  assert.equal(categoryLabel('logic', 'zh'), '逻辑推理')
  assert.equal(categoryLabel('logic', 'en'), 'Logic')
  assert.equal(categoryLabel('knowledge', 'en'), 'Knowledge')
  assert.equal(sourceLabel('live', 'zh'), '现场调用')
  assert.equal(sourceLabel('live', 'en'), 'Live call')
  assert.equal(sourceLabel('user', 'en'), 'User-provided')
})

test('prompt suite holds: unique ids, all eight categories exactly once, fixed text present', () => {
  assert.equal(arenaPrompts.length, 8)
  assert.equal(new Set(arenaPrompts.map(prompt => prompt.id)).size, 8)
  const categories = arenaPrompts.map(prompt => prompt.category)
  assert.deepEqual([...categories].sort(), ['creative', 'instruction', 'knowledge', 'logic', 'math', 'summary', 'translation', 'writing'])
  for (const prompt of arenaPrompts) {
    assert.ok(prompt.prompt.length > 20)
    assert.ok(prompt.title.zh && prompt.title.en)
    assert.ok(prompt.note.zh && prompt.note.en)
  }
})

test('round data stays valid: known prompts, no duplicate model+date, verbatim answers, bilingual verdicts', () => {
  assert.ok(arenaRounds.length >= 1)
  const dates = arenaRounds.map(round => round.date)
  assert.deepEqual(dates, [...dates].sort((a, b) => (a < b ? 1 : -1)))
  for (const round of arenaRounds) {
    assert.match(round.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(findPrompt(arenaPrompts, round.promptId), `unknown promptId: ${round.promptId}`)
    assert.ok(round.verdict.zh && round.verdict.en)
    assert.ok(round.answers.length >= 1)
    const seen = new Set()
    for (const answer of round.answers) {
      assert.match(answer.date, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(['live', 'user'].includes(answer.source))
      assert.ok(answer.model && answer.answer.trim().length > 0)
      const key = `${answer.model}+${answer.date}`
      assert.ok(!seen.has(key), `duplicate model+date in round: ${key}`)
      seen.add(key)
    }
  }
})
