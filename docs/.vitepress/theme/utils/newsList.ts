import type { NewsItem, NewsKind } from '../news'

export type NewsLocale = 'zh' | 'en'

/** 日期降序；不信任文件顺序，消费端一律先过这个 */
export function sortNewsDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/** 按月分组（降序），返回 ['YYYY-MM', items][] */
export function groupNewsByMonth(items: NewsItem[]): [string, NewsItem[]][] {
  const groups = new Map<string, NewsItem[]>()
  for (const item of sortNewsDesc(items)) {
    const month = item.date.slice(0, 7)
    const group = groups.get(month)
    if (group) group.push(item)
    else groups.set(month, [item])
  }
  return [...groups.entries()]
}

const KIND_LABELS: Record<NewsKind, [string, string]> = {
  model: ['模型', 'Model'],
  product: ['产品', 'Product'],
  industry: ['行业', 'Industry'],
}

export function kindLabel(kind: NewsKind, locale: NewsLocale = 'zh'): string {
  return KIND_LABELS[kind][locale === 'en' ? 1 : 0]
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** '2026-09' → '2026 年 9 月' / 'Sep 2026' */
export function monthLabel(month: string, locale: NewsLocale = 'zh'): string {
  const [year, m] = month.split('-')
  if (!year || !m) return month
  return locale === 'en' ? `${EN_MONTHS[Number(m) - 1] ?? m} ${year}` : `${year} 年 ${Number(m)} 月`
}
