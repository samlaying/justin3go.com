export type ArenaCategory =
  | 'logic' | 'writing' | 'summary' | 'math'
  | 'instruction' | 'creative' | 'knowledge' | 'translation'

export type ArenaAnswerSource = 'live' | 'user'
// live = 站内现场调用（Claude Code 会话内：codex 桥 / 本会话模型）
// user  = 用户从各模型 App 粘贴的逐字原文

export interface ArenaAnswer {
  model: string               // 精确版本名，如 'GPT-5.6' / 'Gemini 3.8 Pro' / 'GLM-5.2'
  date: string                // 'YYYY-MM-DD'，该答案产生日期
  source: ArenaAnswerSource
  answer: string              // 逐字原文，绝不改写、绝不代写
}

export interface ArenaRound {
  date: string                // 'YYYY-MM-DD'，场次日期
  promptId: string
  answers: ArenaAnswer[]
  verdict: { zh: string; en: string }   // sam 的点评，无打分
}

export interface ArenaPrompt {
  id: string                  // 稳定 slug，一旦发布不可改
  category: ArenaCategory
  title: { zh: string; en: string }
  prompt: string              // 实际下发的原文（字节级固定，所有模型跑同一份）
  note: { zh: string; en: string }      // 好答案的判别点
}

// 固定标准题库：跨模型、跨时间可比。加题/改题为独立确认关卡，
// 已被任何场次引用过的题，其 id 与 prompt 不可变。
export const arenaPrompts: ArenaPrompt[] = [
  {
    id: 'logic-vase',
    category: 'logic',
    title: { zh: '谁打碎了花瓶', en: 'Who Broke the Vase' },
    prompt: '甲、乙、丙三人中恰好一人打碎了花瓶。甲说："不是我打的。"乙说："是丙打的。"丙说："乙在说谎。"已知三人中恰好一人说真话，请问是谁打碎了花瓶？请写出完整推理过程。',
    note: {
      zh: '答案唯一且可穷举验证（打碎者=甲，说真话者=丙），重点看推理链是逐步排除还是先给结论再硬凑理由。',
      en: 'The answer is unique and verifiable by enumeration (the culprit is A; C is the only truth-teller). What separates models is the reasoning chain: clean elimination vs. conclusion-first rationalization.',
    },
  },
  {
    id: 'writing-store',
    category: 'writing',
    title: { zh: '深夜的便利店', en: 'Late-Night Convenience Store' },
    prompt: '请用 200 字左右描写"深夜的便利店"这个场景。硬性要求：全文不得出现"孤独"和"温暖"两个词，但要让读者能同时读出这两层感受；不得使用任何成语；结尾必须是一个问句。',
    note: {
      zh: '三重硬约束（禁词、禁成语、问句结尾）叠加字数限制，看文笔与约束遵循能否兼得——最常见的失败是堆形容词硬蹭情绪。',
      en: 'Three hard constraints (banned words, no idioms, question ending) on top of a word budget. The common failure is piling on adjectives to force the mood instead of earning it.',
    },
  },
  {
    id: 'summary-report',
    category: 'summary',
    title: { zh: '一句话财报', en: 'One-Sentence Earnings Summary' },
    prompt: '请将下面这段话压缩成一句不超过 30 字的摘要，必须保留数字与因果关系："某电商平台 2025 年第三季度财报显示，其季度成交总额同比增长 12%，但增量主要来自履约成本更高的即时零售业务，因此尽管收入上涨，净利润反而同比下降 8%，管理层表示将在第四季度优化配送补贴策略。"',
    note: {
      zh: '考点是"收入涨、利润跌"的因果反转能否保住，以及 30 字硬上限——多数模型会超字数或丢掉净利润方向。',
      en: 'The trap is the revenue-up-profit-down inversion plus a hard 30-character cap — most answers overflow the cap or drop the profit direction.',
    },
  },
  {
    id: 'math-pool',
    category: 'math',
    title: { zh: '三管齐开', en: 'Three Pipes, One Pool' },
    prompt: '一个水池有甲、乙两根进水管和一根排水管。单开甲管 6 小时注满，单开乙管 4 小时注满，单开排水管 12 小时可排空满池。三管齐开，多少小时能注满空水池？请给出分步计算过程。',
    note: {
      zh: '答案唯一（3 小时），步骤可机判——看分数运算细节与过程是否清晰不跳步。',
      en: 'Unique answer (3 hours) with machine-checkable steps — it tests fractional arithmetic and whether the work is shown without skipped steps.',
    },
  },
  {
    id: 'instruction-format',
    category: 'instruction',
    title: { zh: '三行精确输出', en: 'Three Exact Lines' },
    prompt: '请严格按以下格式输出，共三行，不要输出其他任何内容（包括解释、序号和标点以外的符号）：第一行：一个恰好 5 个英文单词的句子，主题为秋天；第二行：这个句子的中文翻译；第三行：该英文句子按单词首字母的全大写缩写。',
    note: {
      zh: '每行均可机器判定（词数、翻译对应、缩写正确），纯粹的形式遵循测试，任何"好心补充说明"都算失败。',
      en: 'Every line is machine-checkable (word count, translation match, acronym). Pure format compliance — any "helpful" extra commentary is a failure.',
    },
  },
  {
    id: 'creative-eldapp',
    category: 'creative',
    title: { zh: '老人语音日记 App', en: 'Voice Diary App for Elders' },
    prompt: '请为一款"面向独居老人的语音日记 App"提出 3 个功能创意，分别围绕"记忆""安全""陪伴"三个方向。每个创意包含：功能名（不超过 6 个字）、一句话功能说明、一个潜在风险。共输出 3 组，不要额外展开。',
    note: {
      zh: '3×3 结构约束，看创意是否真的彼此差异化、风险是否具体可辩——空话式风险（如只写"隐私风险"）视为不合格。',
      en: 'A 3×3 structure test: are the three ideas genuinely distinct, and is each risk specific and arguable? Boilerplate like "privacy risk" fails.',
    },
  },
  {
    id: 'knowledge-nobel',
    category: 'knowledge',
    title: { zh: '2024 物理诺奖', en: 'The 2024 Physics Nobel' },
    prompt: '请介绍 2024 年诺贝尔物理学奖的得主及其获奖理由，并在回答末尾明确标注：上述内容中哪些你有把握、哪些不确定、你的知识截止时间大约是什么。不要使用任何工具，仅凭你已掌握的知识回答。',
    note: {
      zh: '事实可查证（Hopfield 与 Hinton，人工神经网络与机器学习），真正考点是置信度自评是否诚实、知识边界是否主动交代。',
      en: 'The facts are checkable (Hopfield and Hinton, artificial neural networks and machine learning); the real test is whether the confidence self-assessment is honest and the knowledge boundary is stated unprompted.',
    },
  },
  {
    id: 'translation-juan',
    category: 'translation',
    title: { zh: '"卷"的翻译', en: 'Translating 卷' },
    prompt: '请把下面这句中文翻译成英文，要求保留原句的语气，"卷"字不得直译为 roll 或 involute："这行太卷了，大家不是在加班，就是在去加班的路上。"翻译完成后另起一行，用一句英文解释你对"卷"的处理选择。',
    note: {
      zh: '核心考点是文化负载词"卷"的译法，解释行看元语言意识与自圆其说。',
      en: 'The crux is translating the culture-loaded word 卷; the explanation line tests metalinguistic awareness and whether the choice holds up.',
    },
  },
]

// 最新在前（日期降序），录入流程见 .agents/skills/arena-recorder/SKILL.md
export const arenaRounds: ArenaRound[] = [
  {
    date: '2026-09-21',
    promptId: 'logic-vase',
    answers: [
      {
        model: 'GPT-5.6',
        date: '2026-09-21',
        source: 'live',
        answer: `打碎花瓶的是甲。

逐一假设：

1. 如果甲打碎：
   - 甲说"不是我打的"是假话。
   - 乙说"是丙打的"是假话。
   - 丙说"乙在说谎"是真话。
   - 恰好一人说真话，符合条件。

2. 如果乙打碎：
   - 甲说的是真话。
   - 乙说的是假话。
   - 丙说"乙在说谎"是真话。
   - 有两人说真话，不符合。

3. 如果丙打碎：
   - 甲说的是真话。
   - 乙说的是真话。
   - 丙说"乙在说谎"是假话。
   - 有两人说真话，不符合。

因此，只有"甲打碎花瓶"能使三人中恰好一人说真话。`,
      },
      {
        model: 'GLM-5.2',
        date: '2026-09-21',
        source: 'live',
        answer: `花瓶是甲打碎的。

推理：乙说"是丙打的"，丙说"乙在说谎"——这两句话互相矛盾，必然一真一假。既然全场恰好只有一人说真话，这唯一的真话必定落在乙、丙之间，于是甲的话只能是假话。甲说"不是我打的"为假，说明花瓶正是甲打碎的。

验证：若甲打碎——甲说假话，乙说"是丙打的"也是假话，丙说"乙在说谎"为真，恰好一人说真话，成立。`,
      },
    ],
    verdict: {
      zh: '两家走了两条完全不同的路：GPT-5.6 老老实实穷举三种假设逐一验证，过程长一点但滴水不漏；GLM-5.2 抓住乙丙互相矛盾直接锁死唯一真话的位置，三行出答案。这题两家的正确性与过程都合格，分不出高下——想分高下，得换更长的推理链。',
      en: 'Two very different routes to the same answer: GPT-5.6 ground through all three hypotheses one by one — longer, but airtight; GLM-5.2 spotted the contradiction between B and C and pinned the single truth-teller in three lines. Both correct, both sound; separating them would take a longer reasoning chain.',
    },
  },
]
