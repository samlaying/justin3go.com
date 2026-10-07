import type { ArticleType } from './blogFilters'

/**
 * 竞品分析专栏的纯函数层。
 *
 * 这个专栏不持有自己的数据文件：文章就是普通博客文章，落在 docs/posts/ 下，
 * frontmatter 写 `type: competitor-analysis`（或标题/标签里带「竞品」「competitor」，
 * 由 inferBlogType 推断）。posts.data.mts 在加载时已经把 type 算好，
 * 所以这里只做过滤与分组，不重复解析。
 */

/** 竞品分析在 blogFilters 里的 type 值；改这里要同步改 BLOG_TYPES */
export const BENCHMARK_TYPE: ArticleType = 'competitor-analysis'

/** 只留竞品分析文章，保持输入顺序（posts.data.mts 已按日期降序） */
export function selectBenchmarkPosts<T extends { type?: string }>(posts: T[]): T[] {
  return posts.filter(post => post.type === BENCHMARK_TYPE)
}

/**
 * 按年分组，年份降序。年份内保持输入顺序（即日期降序）。
 * 不信任输入顺序，年份一律自己排——消费端不必先排序。
 */
export function groupByYear<T extends { date: { year: string } }>(posts: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const post of posts) {
    const year = post.date.year
    const group = groups.get(year)
    if (group) group.push(post)
    else groups.set(year, [post])
  }
  return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
}
