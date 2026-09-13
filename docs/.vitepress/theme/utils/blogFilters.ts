export const BLOG_TYPES = [
  { value: 'all', label: '全部', labelEn: 'All' },
  { value: 'product-analysis', label: '产品分析', labelEn: 'Product analysis' },
  { value: 'ai-practice', label: 'AI 产品实践', labelEn: 'AI practice' },
  { value: 'tech-learning', label: '技术学习', labelEn: 'Tech learning' },
  { value: 'code', label: '代码仓库', labelEn: 'Code' },
  { value: 'llm-paper', label: '大模型论文', labelEn: 'LLM papers' },
] as const

export type BlogType = typeof BLOG_TYPES[number]['value']
export type ArticleType = Exclude<BlogType, 'all'>

const TYPE_RULES: Array<{ type: ArticleType; terms: string[] }> = [
  { type: 'llm-paper', terms: ['论文', 'paper', 'arxiv', 'research paper'] },
  { type: 'product-analysis', terms: ['产品', 'product', '竞品', 'competitor', '评测', 'review', 'launch', 'directory'] },
  { type: 'ai-practice', terms: ['vibe coding', 'prompt', 'harness', 'skill', 'loop engineering', 'coding agent', 'agent workflow'] },
  { type: 'tech-learning', terms: ['javascript', 'typescript', 'vue', 'react', 'css', 'python', 'rust', 'nestjs', 'django', 'redis', 'sql', '数据库', '算法'] },
  { type: 'code', terms: ['代码', 'code', 'github', '实现', 'snippet'] },
]

export function inferBlogType(input: { type?: string; sourceFile?: string; title?: string; tags?: string[] }): ArticleType | undefined {
  if (BLOG_TYPES.some(item => item.value === input.type && item.value !== 'all')) return input.type as ArticleType
  const haystack = [input.sourceFile, input.title, ...(input.tags || [])].filter(Boolean).join(' ').toLowerCase()
  for (const rule of TYPE_RULES) if (rule.terms.some(term => haystack.includes(term))) return rule.type
  return undefined
}

export function getType(query: Record<string, unknown>): BlogType {
  const value = Array.isArray(query.type) ? query.type[0] : query.type
  return BLOG_TYPES.some(item => item.value === value) ? value as BlogType : 'all'
}

export function getPage(query: Record<string, unknown>, totalPages = 1): number {
  const value = Array.isArray(query.page) ? query.page[0] : query.page
  const page = Number(value)
  if (!Number.isFinite(page) || page < 1) return 1
  return Math.min(Math.floor(page), Math.max(1, totalPages))
}

export function filterPosts<T extends { type?: string }>(posts: T[], type: BlogType): T[] {
  if (type === 'all' || !BLOG_TYPES.some(item => item.value === type)) return posts
  return posts.filter(post => post.type === type)
}

export function paginatePosts<T>(posts: T[], page: number, pageSize: number) {
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10
  const totalPages = Math.max(1, Math.ceil(posts.length / safePageSize))
  const safePage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages)
  return {
    items: posts.slice((safePage - 1) * safePageSize, safePage * safePageSize),
    total: posts.length,
    totalPages,
  }
}
