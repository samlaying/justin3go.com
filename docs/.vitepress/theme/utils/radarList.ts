/**
 * AI 雷达的数据协议与纯函数层。
 *
 * 这个栏目不是新闻聚合：每条记录的是一次「判断」——为什么是现在、
 * 改变了什么产品设计、我的看法是什么。当前数据为手工维护的 mock，
 * 之后接自动抓取时，候选池仍要经过人工回答七问后才进入这份列表。
 */

/** 顶部过滤 Tab；signal 不是独立数据源，而是「多个事件共同指向的趋势」这一条目类型 */
export const RADAR_KINDS = [
  { value: 'all', label: '全部', labelEn: 'All' },
  { value: 'product', label: '产品', labelEn: 'Products' },
  { value: 'technology', label: '技术', labelEn: 'Technology' },
  { value: 'signal', label: '趋势', labelEn: 'Signals' },
] as const

export type RadarKind = Exclude<(typeof RADAR_KINDS)[number]['value'], 'all'>
export type RadarKindFilter = (typeof RADAR_KINDS)[number]['value']

/** 状态是我的判断，不是搜索量排行——否则又变成资讯站 */
export const RADAR_STATUSES = ['emerging', 'heating', 'surge', 'mainstream', 'cooling'] as const
export type RadarStatus = (typeof RADAR_STATUSES)[number]

export const RADAR_STATUS_META: Record<RadarStatus, { label: string; labelEn: string; icon: string }> = {
  emerging: { label: '萌芽', labelEn: 'Emerging', icon: '🌱' },
  heating: { label: '升温', labelEn: 'Heating', icon: '🔥' },
  surge: { label: '爆发', labelEn: 'Surging', icon: '⚡' },
  mainstream: { label: '常态', labelEn: 'Mainstream', icon: '🌊' },
  cooling: { label: '降温', labelEn: 'Cooling', icon: '❄️' },
}

export interface RadarItem {
  /** URL 友好的唯一 id，完整分析文章就绪后也用它做文件名 */
  id: string
  title: string
  titleEn: string
  /** YYYY-MM-DD，最近更新日 */
  date: string
  type: RadarKind
  status: RadarStatus
  /** 一句话定位，列表卡片的副标题 */
  summary: string
  summaryEn: string
  /** 01/02 问：为什么偏偏是现在（signal 条目写证据链由来） */
  whyNow: string
  whyNowEn: string
  /** 03 问：依赖了什么新的模型 / 工程能力 */
  capabilityShift: string
  capabilityShiftEn: string
  /** 04 问：改变了哪些产品设计 */
  productShift: string
  productShiftEn: string
  /** 05 问：什么场景真的有价值、什么其实没必要 */
  realUseCase: string
  realUseCaseEn: string
  /** 06 问：真正落地最大的阻碍 */
  failure: string
  failureEn: string
  /** 07 问：我的判断 */
  myTake: string
  myTakeEn: string
  /** 继续观察什么 */
  watch?: string
  watchEn?: string
  /** signal 条目的证据链 */
  evidence?: string[]
  evidenceEn?: string[]
  companies?: string[]
  products?: string[]
  topics: string[]
  /** Radar Score（1–5，加权后的综合判断） */
  score: number
  featured?: boolean
  /** 关联的构建记录线 id，形成 Radar → Building 闭环 */
  relatedBuilds?: string[]
}

export const radarItems: RadarItem[] = [
  {
    id: 'personal-agent',
    title: 'Personal Agent',
    titleEn: 'Personal Agent',
    date: '2026-10-07',
    type: 'product',
    status: 'heating',
    score: 5,
    featured: true,
    summary: 'AI 从一次性工具走向长期存在的个人代理：Muse、Dots、Instinct 把「代理」做成了常驻服务。',
    summaryEn: 'AI is moving from one-off tools to persistent personal agents: Muse, Dots, and Instinct ship agents as standing services.',
    whyNow: 'Memory、Cloud Computer、Tool Use、Long-running Agent 同时趋于成熟——个人代理的四个前提第一次凑齐。',
    whyNowEn: 'Memory, cloud computers, tool use, and long-running agents all matured at once — the four preconditions met for the first time.',
    capabilityShift: '长任务的可靠性（多步不跑偏）、云端持久环境、工具调用标准化、长期记忆的检索质量——四项能力同时跨过可用线。',
    capabilityShiftEn: 'Long-task reliability (no drift across steps), persistent cloud environments, standardized tool calls, and retrieval-grade long-term memory all crossed the usable line together.',
    productShift: '用户不再逐个打开 App，而是向 Agent 表达目标；入口从应用层上移到代理层。',
    productShiftEn: 'Users stop opening apps one by one and state goals to an agent instead; the entry point moves up from the app layer.',
    realUseCase: '真有价值：日程、邮件、信息流的例行整理与待办跟进——高频、低风险、结果可验证。没必要：一上来就托管支付和大额决策——信任还没建立。',
    realUseCaseEn: 'Genuinely valuable: routine triage of calendars, email, and feeds — high frequency, low risk, verifiable. Not needed yet: delegating payments and big decisions — the trust isn\'t built.',
    failure: '权限与隐私边界。用户嘴上要主动服务，行为上对「Agent 替我做决定」极其敏感：权限给少了没用了，给多了不敢用。',
    failureEn: 'Permission and privacy boundaries. Users ask for proactive service but behave defensively about agents deciding for them: too little permission is useless, too much is scary.',
    myTake: '中国版本未必长成独立 App，更可能嵌在超级 App / IM / OS 层。真正的竞争从「谁完成任务」转向「谁最了解用户」。',
    myTakeEn: 'In China it probably won\'t be a standalone app — more likely embedded in a super app / IM / OS layer. Competition shifts from who completes tasks to who knows the user best.',
    watch: '权限模型、Personal Context、主动执行的接受率、支付、多人协作。',
    watchEn: 'Permission model, personal context, opt-in rate for proactive actions, payments, multi-user collaboration.',
    companies: ['Meta', 'OpenAI', 'Google'],
    products: ['Muse', 'Dots', 'Instinct', 'OpenAI Dots'],
    topics: ['agent', 'memory', 'personal-context'],
  },
  {
    id: 'agent-harness',
    title: 'Agent Harness',
    titleEn: 'Agent Harness',
    date: '2026-10-05',
    type: 'technology',
    status: 'surge',
    score: 4.7,
    summary: 'Agent 产品的竞争开始进入工程层：上下文管理、工具调度、评估这套「脚手架」成为新的核心资产。',
    summaryEn: 'Agent competition is moving to the engineering layer: the scaffolding of context management, tool orchestration, and evals becomes the core asset.',
    whyNow: '单纯调模型的差异在消失——能力趋同后，差异转移到了模型外围的脚手架上。',
    whyNowEn: 'Model-level differences are fading — once capabilities converge, differentiation moves to the scaffolding around the model.',
    capabilityShift: '长上下文成本下降、结构化工具调用、评估自动化——把「调一次模型」变成「跑一条可靠流水线」第一次成为可能。',
    capabilityShiftEn: 'Falling long-context costs, structured tool calls, and automated evals — running a reliable pipeline instead of a single model call became possible for the first time.',
    productShift: '「会聊」不再稀缺，「可靠地完成」才稀缺；产品重心从对话体验转向任务闭环。',
    productShiftEn: 'Chatting well is no longer scarce; completing reliably is. Product focus shifts from conversation to task closure.',
    realUseCase: '高价值：客服、数据分析、代码这类可验证的闭环任务——harness 能把成功率从「演示级」拉到「生产级」。没必要：一次性简单问答——套 harness 是过度工程。',
    realUseCaseEn: 'High value: verifiable closed-loop tasks like support, data analysis, and code — harnesses lift success rates from demo-grade to production-grade. Not needed: one-shot Q&A, where a harness is over-engineering.',
    failure: '复杂度换来了可靠性，也换来了维护成本：上下文膨胀、工具版本漂移、评估集过拟合——harness 本身正在成为新的技术债高发区。',
    failureEn: 'Complexity buys reliability but also maintenance cost: context bloat, tool-version drift, overfit eval sets — the harness itself is becoming a new hotspot for tech debt.',
    myTake: 'Prompt 工程的叙事已经过时，接下来是 Harness 工程：谁把上下文、工具、评估组织得更好，谁就赢在长任务。',
    myTakeEn: 'The prompt-engineering story is dated; what comes next is harness engineering — whoever organizes context, tools, and evals better wins long tasks.',
    watch: 'harness 的开源标准、评估基准、与 IDE / 浏览器的融合。',
    watchEn: 'Open harness standards, eval benchmarks, convergence with IDEs / browsers.',
    topics: ['agent', 'harness', 'evals'],
    relatedBuilds: ['site'],
  },
  {
    id: 'context-engineering',
    title: 'Context Engineering',
    titleEn: 'Context Engineering',
    date: '2026-10-03',
    type: 'technology',
    status: 'heating',
    score: 4.2,
    summary: '上下文正在成为产品资产：谁能为模型组织好上下文，谁就有护城河。',
    summaryEn: 'Context is becoming a product asset: whoever organizes context well for the model holds the moat.',
    whyNow: '长上下文、Memory、检索质量同时跨过实用线，「喂什么」开始比「怎么问」更影响结果。',
    whyNowEn: 'Long context, memory, and retrieval all crossed the practical line at once — what you feed matters more than how you ask.',
    capabilityShift: '百万级 token 上下文、稳定的多路召回、记忆分层写入——「喂给模型什么」第一次可以被工程化设计。',
    capabilityShiftEn: 'Million-token contexts, stable multi-path recall, tiered memory writes — what to feed the model became engineerable for the first time.',
    productShift: '产品设计从「管理功能」变成「管理与模型相关的信息」：收藏、剪贴、日程都在变成上下文源。',
    productShiftEn: 'Product design shifts from managing features to managing model-facing information: bookmarks, clips, and calendars all become context sources.',
    realUseCase: '高价值：长期伴随型产品（笔记、CRM、Agent）——上下文质量直接等于回答质量。没必要：单次问答工具——上下文工程是屠龙刀切菜。',
    realUseCaseEn: 'High value: long-term companion products (notes, CRM, agents) — context quality directly equals answer quality. Not needed: single-shot Q&A tools, where it\'s a cleaver for vegetables.',
    failure: '上下文的隐私与所有权：数据留在产品里越久产品越聪明，用户也越难离开、越难删除——监管和信任都会来敲门。',
    failureEn: 'Privacy and ownership of context: the longer data stays, the smarter the product and the harder to leave or delete — regulators and trust both come knocking.',
    myTake: '上下文工程会像当年的信息架构一样成为独立的设计学科，而且会直接决定 Agent 产品的留存。',
    myTakeEn: 'Context engineering will become its own design discipline, like information architecture did — and it will directly decide agent-product retention.',
    watch: '个人上下文的可移植性、跨产品的上下文交换格式。',
    watchEn: 'Portability of personal context, cross-product context exchange formats.',
    topics: ['context', 'memory', 'retrieval'],
  },
  {
    id: 'mcp',
    title: 'MCP',
    titleEn: 'MCP',
    date: '2026-09-28',
    type: 'technology',
    status: 'mainstream',
    score: 3.8,
    summary: 'Model Context Protocol 从新闻变成水电：工具接入的默认协议。',
    summaryEn: 'Model Context Protocol went from news to plumbing: the default protocol for tool integration.',
    whyNow: '主流厂商全部支持，生态过了临界点——不兼容的成本已经高于兼容的成本。',
    whyNowEn: 'Every major vendor supports it; the ecosystem passed the tipping point where not supporting it costs more than supporting it.',
    capabilityShift: '基于 JSON-RPC 的工具描述标准化 + 主流客户端运行时支持——工具接入从「每家私有 SDK」变成「一次实现处处可挂」。',
    capabilityShiftEn: 'Standardized tool descriptions over JSON-RPC plus mainstream client runtime support — integration went from per-vendor SDKs to implement once, mount everywhere.',
    productShift: '集成成本骤降，小团队也能把整套工具生态接进 Agent；「支持 MCP」正在变成 RFP 默认项。',
    productShiftEn: 'Integration cost collapses; small teams can wire whole tool ecosystems into agents. MCP support is becoming an RFP default.',
    realUseCase: '高价值：企业把存量系统（CRM、ERP、工单）暴露给内部 Agent，集成成本降一个量级。没必要：为单个小组件单独起 MCP server——直接函数调用更省。',
    realUseCaseEn: 'High value: enterprises exposing legacy systems (CRM, ERP, tickets) to internal agents at an order-of-magnitude lower cost. Not needed: spinning up an MCP server for one small tool — a direct function call is cheaper.',
    failure: '安全与治理：任意 MCP server 等于把提示注入面开放给第三方；权限粒度、审计、沙箱都还在补课。',
    failureEn: 'Security and governance: arbitrary MCP servers open a prompt-injection surface to third parties; permission granularity, auditing, and sandboxing are still catching up.',
    myTake: '协议本身不再是壁垒，基于协议的治理与权限设计才是。就像 HTTP 造就的是网站，不是协议本身。',
    myTakeEn: 'The protocol is no longer the moat — governance and permission design on top of it are. HTTP made websites valuable, not the other way around.',
    topics: ['mcp', 'tooling', 'protocol'],
  },
  {
    id: 'ai-browser',
    title: 'AI Browser',
    titleEn: 'AI Browser',
    date: '2026-09-25',
    type: 'product',
    status: 'heating',
    score: 4,
    summary: '浏览器重新成为 Agent 的主要载体：Dia、Comet 把代理直接做进浏览场景。',
    summaryEn: 'The browser is back as the main agent vehicle: Dia and Comet build agents straight into the browsing surface.',
    whyNow: 'Computer Use 能力成熟，加上浏览器天然拥有上下文——历史、登录态、页面结构。',
    whyNowEn: 'Computer use matured, and the browser natively holds context — history, login state, page structure.',
    capabilityShift: '视觉定位的操作（截图理解 + 坐标点击）稳定性提升，加上 DOM 结构化读取——网页从「给人看的」变成「可被代办的」。',
    capabilityShiftEn: 'Vision-grounded operation (screenshot understanding + coordinate clicking) stabilized, plus structured DOM reading — pages went from human-only to delegable.',
    productShift: '浏览器从「显示工具」变成「执行代理」，页面开始为 Agent 而设计，而不只是为人。',
    productShiftEn: 'The browser shifts from display tool to executing agent; pages start being designed for agents, not just humans.',
    realUseCase: '高价值：跨站点的重复流程（比价、填报、报销）——用户本来就要开着浏览器做的事。没必要：阅读型浏览——人自己读更快，也更享受。',
    realUseCaseEn: 'High value: repetitive cross-site flows (price checks, form filling, expense reports) — things users do in a browser anyway. Not needed: reading-oriented browsing — humans read faster and enjoy it more.',
    failure: '网站的反自动化对抗（验证码、条款、封号）；Agent 流量在商业模型上还没被定价——站长没有动力欢迎它。',
    failureEn: 'Anti-automation pushback (captchas, terms, bans); agent traffic has no pricing model yet — site owners have no incentive to welcome it.',
    myTake: '这是分发入口之争：谁先让用户养成「让浏览器代办」的习惯，谁就拿到下一个十年的默认入口。',
    myTakeEn: 'This is a distribution fight: whoever first makes "let the browser handle it" a habit wins the default entry point of the next decade.',
    watch: 'agent 流量占比、站点对 agent 的反爬态度、新导航形态。',
    watchEn: 'Share of agent traffic, site anti-bot posture toward agents, new navigation forms.',
    products: ['Dia', 'Comet'],
    topics: ['browser', 'computer-use', 'distribution'],
  },
  {
    id: 'group-agent',
    title: 'Group Agent',
    titleEn: 'Group Agent',
    date: '2026-09-20',
    type: 'product',
    status: 'emerging',
    score: 3.5,
    summary: '个人 Agent 开始进入多人关系：共享代理出现在群聊、家庭与小团队里。',
    summaryEn: 'Personal agents are entering multi-user territory: shared agents show up in group chats, families, and small teams.',
    whyNow: '单人 Agent 验证了价值，自然延伸到多人授权与协作场景。',
    whyNowEn: 'Single-user agents proved their value; multi-user authorization is the natural extension.',
    capabilityShift: '多主体权限模型（谁可以授权 Agent 做什么）+ 共享记忆的冲突解决——单人 Agent 的能力栈加上「社交层」。',
    capabilityShiftEn: 'Multi-principal permission models (who may authorize what) plus conflict resolution over shared memory — the single-user stack gains a social layer.',
    productShift: '权限模型从「我的」变成「我们的」，产品设计第一次要处理 Agent 的社交关系。',
    productShiftEn: 'The permission model shifts from "mine" to "ours" — product design has to handle an agent\'s social graph for the first time.',
    realUseCase: '高价值：家庭共享事务（账单、采购、日程协调）和小团队的例会纪要跟进。没必要：群聊娱乐场景——多一个插话的机器人只会更吵。',
    realUseCaseEn: 'High value: shared household matters (bills, purchases, schedule coordination) and small-team meeting follow-ups. Not needed: entertainment group chats — one more bot talking is just noisier.',
    failure: '责任归属：Agent 在多人场景里做错事算谁的？出错后的回滚与道歉机制完全没有标准。',
    failureEn: 'Accountability: when an agent errs in a multi-user setting, whose fault is it? Rollback and remediation have no standards at all.',
    myTake: '需求真实存在，但隐私边界和成本分摊还没人想清楚；早期更可能在家庭场景先跑通。',
    myTakeEn: 'The need is real, but privacy boundaries and cost sharing are unsolved; family scenarios will likely crack it first.',
    topics: ['agent', 'collaboration', 'multi-user'],
  },
  {
    id: 'software-agent-facing',
    title: '软件正在变成 agent-facing',
    titleEn: 'Software is becoming agent-facing',
    date: '2026-09-18',
    type: 'signal',
    status: 'heating',
    score: 4.4,
    summary: '多个事件指向同一件事：软件在为 Agent——而不是人——重新设计自己的门面。',
    summaryEn: 'Multiple events point to one thing: software is redesigning its front door for agents, not humans.',
    whyNow: '过去一个月的证据链，见下方。',
    whyNowEn: 'The evidence chain from the past month, listed below.',
    capabilityShift: '协议（MCP）+ 能力（Computer Use）+ 身份（Agent 流量可识别）三者同时就位——「为 Agent 设计接口」第一次有完整的底层栈。',
    capabilityShiftEn: 'Protocol (MCP) + capability (computer use) + identity (agent traffic is identifiable) all landed together — designing interfaces for agents has a complete underlying stack for the first time.',
    productShift: '「对 Agent 可见」开始进入产品与增长的设计范围，像当年的移动端适配一样。',
    productShiftEn: 'Being visible to agents enters product and growth scope, the way mobile responsiveness did.',
    realUseCase: '高价值：内容、电商、SaaS 的获客——agent 推荐正在变成新的搜索排名。没必要：纯人际信任型服务（高端定制、医疗）——Agent 夹在中间反而降低信任。',
    realUseCaseEn: 'High value: acquisition for content, e-commerce, and SaaS — agent recommendation is becoming the new search ranking. Not needed: trust-based personal services (bespoke, medical) — an agent in the middle lowers trust.',
    failure: '反滥用：开放的 agent 入口也是攻击面（爬虫、垃圾提交、价格操纵），治理工具远落后于开放速度。',
    failureEn: 'Abuse control: an open agent entry point is also an attack surface (scraping, spam submissions, price manipulation); governance tools lag far behind the pace of opening up.',
    myTake: '下一轮「SEO」是 agent 可见性优化：产品要不要对 Agent 开放、开放到什么程度，会变成增长命题。',
    myTakeEn: 'The next SEO is agent visibility optimization: whether and how much to open up to agents becomes a growth question.',
    evidence: [
      'MCP 成为工具接入默认协议（常态化）',
      'Dia / Comet 把代理做进浏览器（入口迁移）',
      '越来越多站点发布 llms.txt（门面改造）',
      'Agent 身份的爬虫流量持续上涨（行为变化）',
    ],
    evidenceEn: [
      'MCP became the default tool-integration protocol (normalization)',
      'Dia / Comet embedded agents into browsers (entry-point migration)',
      'More sites publish llms.txt (storefront redesign)',
      'Agent-identified crawler traffic keeps rising (behavior change)',
    ],
    topics: ['signal', 'aio', 'distribution'],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    titleEn: 'Prompt Engineering',
    date: '2026-09-10',
    type: 'technology',
    status: 'cooling',
    score: 2.5,
    summary: '作为独立技能的提示词工程正在退潮：被 harness、skill 与更强的模型吸收。',
    summaryEn: 'Prompt engineering as a standalone skill is receding: absorbed by harnesses, skills, and stronger models.',
    whyNow: '模型指令遵循能力提升后，手工调 prompt 的边际收益快速下降。',
    whyNowEn: 'As instruction-following improved, the marginal return of hand-tuning prompts dropped fast.',
    capabilityShift: '模型内置的指令遵循与少样本泛化变强；harness、skill 把提示词固化成代码——手工艺被工业化取代。',
    capabilityShiftEn: 'Built-in instruction following and few-shot generalization improved; harnesses and skills turned prompts into code — craft replaced by industry.',
    productShift: '「提示词库」类产品价值缩水，价值转向上下文与工具的组织方式。',
    productShiftEn: 'Prompt-library products lose value; value moves to how context and tools are organized.',
    realUseCase: '仍有价值：系统级 prompt 设计（产品人格、安全边界）——这是产品决策，不是调参玄学。没必要：逐句「咒语优化」——边际收益已接近零。',
    realUseCaseEn: 'Still valuable: system-level prompt design (product persona, safety boundaries) — a product decision, not tuning folklore. Not needed: word-by-word incantation tuning — marginal returns near zero.',
    failure: '它的问题不是失败而是被吸收：能力下沉到模型与框架层之后，独立的优化空间消失了——这正是降温的原因。',
    failureEn: 'Its issue isn\'t failure but absorption: once the capability sank into models and frameworks, the standalone optimization space vanished — which is exactly why it\'s cooling.',
    myTake: '会写 prompt 仍是基本功，但它不再是职位——会像「会用搜索引擎」一样变成默认能力。',
    myTakeEn: 'Writing prompts remains a basic skill, but no longer a job — like "can use a search engine", it becomes table stakes.',
    topics: ['prompt', 'skills'],
  },
]

/** 按 Tab 过滤；'all' 原样返回（新数组，避免消费端误改源数据） */
export function filterRadarItems<T extends { type: RadarKind }>(items: T[], kind: RadarKindFilter): T[] {
  if (kind === 'all') return [...items]
  return items.filter(item => item.type === kind)
}

/** 日期降序为主，同日按 score 降序——不信任输入顺序 */
export function sortRadarItems<T extends { date: string; score: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.date === b.date ? b.score - a.score : a.date < b.date ? 1 : -1))
}

/** 看板顶部「最近更新」取全量最大日期，与当前过滤无关 */
export function latestRadarDate(items: { date: string }[]): string {
  return items.reduce((latest, item) => (item.date > latest ? item.date : latest), '')
}

/** 首页 watching 模块：score 降序为主，同分按日期降序 */
export function topRadarItems<T extends { date: string; score: number }>(items: T[], limit: number): T[] {
  return [...items].sort((a, b) => (a.score === b.score ? (a.date < b.date ? 1 : -1) : b.score - a.score)).slice(0, limit)
}
