export type NewsKind = 'model' | 'product' | 'industry'

export interface NewsItem {
  date: string                          // 'YYYY-MM-DD'，官方公告日
  title: { zh: string; en: string }
  comment: { zh: string; en: string }   // sam 的一句话点评
  url: string                           // 主源外链（官方博客 / 官方 X / 官网）
  source: string                        // 如 'OpenAI' / 'Anthropic' / 'Google DeepMind'
  kind: NewsKind                        // 模型 / 产品 / 行业
}

// 最新在前（日期降序），更新流程见 .agents/skills/ai-news-updater/SKILL.md
export const news: NewsItem[] = [
  {
    date: '2026-09-21',
    title: {
      zh: '阿里开源 Qwen-Image-2.1：一个模型同时做生成与编辑',
      en: 'Alibaba opens Qwen-Image-2.1: one model for both generation and editing',
    },
    comment: {
      zh: '7.1B 单卡 4090 就能跑生成+编辑，开源图像模型卷进消费级了。',
      en: 'A 7.1B open-weights model that generates and edits images on a single RTX 4090 — open image models just went consumer-grade.',
    },
    url: 'https://x.com/Alibaba_Qwen/status/2101659302792679789',
    source: 'Alibaba Qwen',
    kind: 'model',
  },
  {
    date: '2026-09-19',
    title: {
      zh: 'Qwen3.8-Omni-Flash：Qwen 首个以 Agent 为核心的全模态模型',
      en: 'Qwen3.8-Omni-Flash: Qwen\'s first omni-modal model built around agentic capability',
    },
    comment: {
      zh: '听、看、想、调一体，原来要拼三条管线的活儿现在一个模型闭环。',
      en: 'Audio, video, reasoning and tool calls close the loop in one model — no more stitching three pipelines together.',
    },
    url: 'https://x.com/Alibaba_Qwen/status/2100785962414702599',
    source: 'Alibaba Qwen',
    kind: 'model',
  },
  {
    date: '2026-09-18',
    title: {
      zh: 'OpenAI 发布 Astra for Law：面向法律行业的前沿模型产品',
      en: 'OpenAI ships Astra for Law, a frontier product for legal work',
    },
    comment: {
      zh: '继医疗、工程之后，前沿模型开始按行业定制交付——合规既是门槛也是壁垒。',
      en: 'After medicine and engineering, frontier models are now delivered per industry — compliance is both the barrier and the moat.',
    },
    url: 'https://x.com/OpenAI/status/2100679992720142459',
    source: 'OpenAI',
    kind: 'product',
  },
  {
    date: '2026-09-17',
    title: {
      zh: 'Anthropic 提出度量前沿 AI 发展速度的新指标',
      en: 'Anthropic proposes new metrics for measuring the pace of frontier AI development',
    },
    comment: {
      zh: '实验室主动把「跑多快」变成可测量的东西，透明化信号值得关注。',
      en: 'A lab volunteering to make "how fast are we going" measurable — a transparency signal worth watching.',
    },
    url: 'https://www.anthropic.com/institute/measuring-pace-of-ai-development',
    source: 'Anthropic',
    kind: 'industry',
  },
  {
    date: '2026-09-16',
    title: {
      zh: 'Google 发布 Gemini 3.8 Live：边说边想边干活的对话模型',
      en: 'Google launches Gemini 3.8 Live, a model that thinks and acts mid-conversation',
    },
    comment: {
      zh: '语音对话里后台就把任务办了，交互流畅度成了新的竞争维度。',
      en: 'It quietly handles tasks in the background while you talk — conversational fluency is the new competitive axis.',
    },
    url: 'https://x.com/GoogleDeepMind/status/2099907440422830269',
    source: 'Google DeepMind',
    kind: 'model',
  },
  {
    date: '2026-09-15',
    title: {
      zh: 'Perplexity 便携 AI 计算机扩展到 Windows RTX 设备',
      en: 'Perplexity brings its portable AI computer to Windows RTX PCs',
    },
    comment: {
      zh: '本地跑 agent 不上传云端，「隐私 + 已有硬件」是很务实的一张牌。',
      en: 'Local agents with no cloud upload — privacy on hardware you already own is a pragmatic play.',
    },
    url: 'https://x.com/perplexity_ai/status/2099514386193027201',
    source: 'Perplexity',
    kind: 'product',
  },
]
