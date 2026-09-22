export type ProductKind = 'experience' | 'watch'
// experience = 体验（真实上手，感受必须来自 sam 本人口述）
// watch      = 关注（客观收录待体验，note 只写客观介绍，不写感受）

export type ProductCategory =
  | 'chat' | 'coding' | 'image' | 'video'
  | 'audio' | 'agent' | 'search' | 'other'

export interface ProductEntry {
  date: string                    // 'YYYY-MM-DD'
  product: string                 // 产品名，同一产品可多条
  url: string                     // 官网/主页 https
  category: ProductCategory
  kind: ProductKind
  note: { zh: string; en: string }
  slug?: string                   // 有体验文章时填（docs/products/<slug>.md），列表产品名链到站内文章
}

// 最新在前（日期降序），录入流程见 .agents/skills/product-recorder/SKILL.md
export const products: ProductEntry[] = [
  {
    date: '2026-09-22',
    product: 'Claude',
    url: 'https://claude.ai',
    category: 'chat',
    kind: 'experience',
    slug: 'claude',
    note: {
      zh: '这一周用 Claude Code 把博客改成三模块站点（新闻/竞技场/产品体验），改配置、写组件、跑测试在一段长对话里一气呵成。',
      en: 'This week I rebuilt the blog into a three-module site (news / arena / products) with Claude Code — config, components and tests in one long conversation.',
    },
  },
  {
    date: '2026-09-21',
    product: 'ChatGPT',
    url: 'https://chatgpt.com',
    category: 'chat',
    kind: 'watch',
    note: {
      zh: 'OpenAI 的对话助手，也是这一轮 AI 产品的起点。',
      en: 'OpenAI\'s conversational assistant — the starting point of this wave of AI products.',
    },
  },
  {
    date: '2026-09-21',
    product: 'Claude',
    url: 'https://claude.ai',
    category: 'chat',
    kind: 'watch',
    note: {
      zh: 'Anthropic 的对话助手，长文本与编程场景口碑突出。',
      en: 'Anthropic\'s conversational assistant, well regarded for long documents and coding.',
    },
  },
  {
    date: '2026-09-21',
    product: 'Gemini',
    url: 'https://gemini.google.com',
    category: 'chat',
    kind: 'watch',
    note: {
      zh: 'Google 的多模态助手，深度接入 Google 全家桶。',
      en: 'Google\'s multimodal assistant, deeply integrated with the Google ecosystem.',
    },
  },
  {
    date: '2026-09-21',
    product: 'Perplexity',
    url: 'https://www.perplexity.ai',
    category: 'search',
    kind: 'watch',
    note: {
      zh: 'AI 搜索引擎，答案附带引用来源，近期在向本地设备拓展。',
      en: 'An AI search engine that cites its sources, recently expanding onto local devices.',
    },
  },
  {
    date: '2026-09-21',
    product: 'Cursor',
    url: 'https://cursor.com',
    category: 'coding',
    kind: 'watch',
    note: {
      zh: 'AI 代码编辑器，把模型协作做进了编辑器本体。',
      en: 'An AI code editor that builds model collaboration into the editor itself.',
    },
  },
  {
    date: '2026-09-21',
    product: 'Midjourney',
    url: 'https://www.midjourney.com',
    category: 'image',
    kind: 'watch',
    note: {
      zh: '图像生成产品，风格化出图是它的招牌。',
      en: 'An image generation product known for its stylized output.',
    },
  },
]
