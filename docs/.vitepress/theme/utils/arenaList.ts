import type { ArenaAnswerSource, ArenaCategory, ArenaPrompt, ArenaRound } from '../arena'

export type ArenaLocale = 'zh' | 'en'

/** 场次按日期降序；不信任文件顺序，消费端一律先过这个 */
export function sortRoundsDesc(rounds: ArenaRound[]): ArenaRound[] {
  return [...rounds].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function findPrompt(prompts: ArenaPrompt[], id: string): ArenaPrompt | undefined {
  return prompts.find(prompt => prompt.id === id)
}

const CATEGORY_LABELS: Record<ArenaCategory, [string, string]> = {
  logic: ['逻辑推理', 'Logic'],
  writing: ['中文写作', 'Writing'],
  summary: ['摘要压缩', 'Summary'],
  math: ['数学', 'Math'],
  instruction: ['指令遵循', 'Instructions'],
  creative: ['创意', 'Creative'],
  knowledge: ['知识时效', 'Knowledge'],
  translation: ['翻译', 'Translation'],
}

export function categoryLabel(category: ArenaCategory, locale: ArenaLocale = 'zh'): string {
  return CATEGORY_LABELS[category][locale === 'en' ? 1 : 0]
}

const SOURCE_LABELS: Record<ArenaAnswerSource, [string, string]> = {
  live: ['现场调用', 'Live call'],
  user: ['用户提供', 'User-provided'],
}

export function sourceLabel(source: ArenaAnswerSource, locale: ArenaLocale = 'zh'): string {
  return SOURCE_LABELS[source][locale === 'en' ? 1 : 0]
}
