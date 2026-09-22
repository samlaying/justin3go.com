import type { ProductCategory, ProductEntry, ProductKind } from '../products'

export type ProductLocale = 'zh' | 'en'

/** 日期降序；不信任文件顺序，消费端一律先过这个 */
export function sortProductsDesc(items: ProductEntry[]): ProductEntry[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/** 按月分组（降序），返回 ['YYYY-MM', items][]；月份标题复用 newsList 的 monthLabel */
export function groupProductsByMonth(items: ProductEntry[]): [string, ProductEntry[]][] {
  const groups = new Map<string, ProductEntry[]>()
  for (const item of sortProductsDesc(items)) {
    const month = item.date.slice(0, 7)
    const group = groups.get(month)
    if (group) group.push(item)
    else groups.set(month, [item])
  }
  return [...groups.entries()]
}

const CATEGORY_LABELS: Record<ProductCategory, [string, string]> = {
  chat: ['对话助手', 'Chat'],
  coding: ['编程工具', 'Coding'],
  image: ['图像生成', 'Image'],
  video: ['视频生成', 'Video'],
  audio: ['音频生成', 'Audio'],
  agent: ['Agent', 'Agent'],
  search: ['AI 搜索', 'Search'],
  other: ['其他', 'Other'],
}

export function categoryLabel(category: ProductCategory, locale: ProductLocale = 'zh'): string {
  return CATEGORY_LABELS[category][locale === 'en' ? 1 : 0]
}

const KIND_LABELS: Record<ProductKind, [string, string]> = {
  experience: ['体验', 'Experienced'],
  watch: ['关注', 'Watching'],
}

export function kindLabel(kind: ProductKind, locale: ProductLocale = 'zh'): string {
  return KIND_LABELS[kind][locale === 'en' ? 1 : 0]
}
