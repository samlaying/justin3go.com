---
title: 'Jev 初体验：一个不生成文本的模型，8 道分类题全对'
date: 2026-09-23
tags:
  - Jev
  - TypeSafe AI
  - System One
  - Model Evaluation
  - LLM
  - API
---

# Jev 初体验：一个不生成文本的模型，8 道分类题全对

> ✨文章摘要（AI生成）
>
<!-- DESC SEP -->
>
> 为了找一段旧对话，我在自己的 Codex 日志里搜「jev」——432 个文件命中，99% 是 base64 噪声，但顺着剩下的真实记录挖出了一个已经配好却没用过的模型：**Jev**（TypeSafe AI 的 System One 决策模型，`jev-1.13.0`）。它不生成文本，只返回**带概率的类型化判断**（Choice/Noul/Score 三种原语）。本文记录两次实测：连通性检查（noul 判断紧急度 0.95，1.1s）和一次 8 道新闻标题分类实验——**8/8 全对**、单次调用 0.58s、2052 tokens，包括「OpenAI 发布面向法律的前沿模型产品」这种标题里带「模型」字样的易错题。结论：判断型和生成型不是竞争关系，把「选择题」从大模型的活儿里拆出来给 Jev，又快又便宜又可校准。
>
<!-- DESC SEP -->

## 引子：432 个命中，99% 是噪声

事情从一句帮忙开始：「搜下我的 Codex 对话日志，哪个文件夹里的对话提及 jev」。

Codex 的会话日志存在 `~/.codex/sessions/年/月/日/rollout-*.jsonl`。裸搜「jev」命中 432 个文件——听起来很多，但抽查上下文就露馅了：绝大多数命中来自**图片附件的 base64 编码**，`jev` 只是随机字符串里恰好出现的三个字母。加上词边界过滤后，真实命中收敛到九月的一小簇，其中一份归档会话（2026-09-21 17:21）的标题是「如何使用 Jev 模型」——内容是给 Claude Code 和 Codex **配置 Jev 的完整过程**。

顺藤摸瓜验证本机：`~/.claude/settings.json` 里果然躺着 `typesafe@typesafe-ai` 插件（v0.5.7，已启用）和一枚 `TYPESAFE_API_KEY`。也就是说，这个模型两天前被配好了，然后被我忘了。

那就实际调一次。先给一句话结论：**Jev 不是又一个聊天模型——它把「判断」做成了编程原语，不生成一个字的文本，直接返回带概率的类型化答案。恰好是我这种内容站最缺的那块零件。**

## 一、Jev 是什么：System One 与三种判断原语

TypeSafe 给 Jev 的定位是 **System One 模型**——借用心理学术语，指快而省的直觉式判断，区别于生成式模型的慢思考。官方文档的表述：

> "TypeSafe makes units of AI intelligence usable like programming primitives… **Jev** is TypeSafe's flagship and first System One model. It understands natural language and returns typed answers and probabilities rather than generating text or reasoning explanations."
>
> （TypeSafe 把 AI 智能单元做得像编程原语一样可用……Jev 是 TypeSafe 的旗舰也是第一个 System One 模型。它理解自然语言，返回**类型化的答案和概率**，而不是生成文本或推理解释。）

它的 API 只有三种问题原语，覆盖判断的三个基本形态：

| 原语 | 回答什么 | 返回 | 一句话 |
|---|---|---|---|
| Choice | 给定选项里选哪个 | choice + 全选项概率分布 | 分类、路由 |
| Noul | 某条件是否成立 | 0–1 概率 | 是非判断 |
| Score | 某维度上处于哪一档 | 概率加权的档位 | 分级、排序 |

（TypeSafe 公司背景、定价策略我没查，本文只谈实测。）

## 二、API 长什么样，以及一个 422

请求就三要素：`state`（给判断用的全部上下文）、`model`、`questions`（问题集合，一次可以问多个，**互相看不见对方答案、并行执行**）。

连通性检查用官方文档里的最小例子——判断一条客服消息是否紧急：

```json
POST https://api.typesafe.ai/v1/systemone
{
  "state": "Help! My payouts have been failing for 3 days.",
  "model": "jev-latest",
  "questions": {
    "is_urgent": {
      "type": "noul",
      "instructions": "Does this convey urgency?"
    }
  }
}
```

返回（2026-09-23 实测，HTTP 200，1.1s）：

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 }
  },
  "usage": { "input_tokens": 283, "output_tokens": 23 }
}
```

「打款失败三天了帮帮我」→ 紧急概率 0.95。没有解释、没有寒暄，**一个浮点数就是完整交付**。

踩的坑也记一下：第一次发分类请求，我把 Choice 的 `criteria` 写成了数组 `["模型","产品","行业"]`，直接 422：

```json
{"type":"dict_type","loc":["body","questions","t1","choice","criteria"],
 "msg":"Input should be a valid dictionary"}
```

正确形态是**字典**——选项名做 key，描述做 value（描述也可以是 `null`）：

```json
"criteria": {
  "模型": "A model release or model capability update…",
  "产品": "An app, product, tool or platform launch…",
  "行业": "Business, policy, funding, regulation news…"
}
```

这个报错反而让我对它放心了一点：**API 契约是强类型的**，错得清楚，改得也快。

## 三、8 道分类题：全对，包括陷阱题

真正有意思的实验来自我博客的实际痛点：AI 动态模块每条新闻要打一个 `kind` 标签（模型/产品/行业），目前靠我拍脑袋。我把 6 条真实新闻标题加上 2 道易错题（融资、法案）塞进**同一次调用**的 8 个 Choice 问题，`state` 里放标题数组，每个问题用 `items[n].title` 引用。

结果（2026-09-23，单次调用 0.58s，1761+291 tokens）：

| # | 标题 | 人工标注 | Jev | 置信 |
|---|---|:---:|:---:|---|
| 1 | 阿里开源 Qwen-Image-2.1 | 模型 | ✅ 模型 | 1.0 |
| 2 | Qwen3.8-Omni-Flash 全模态模型 | 模型 | ✅ 模型 | 1.0 |
| 3 | OpenAI 发布 Astra for Law：面向法律行业的**前沿模型产品** | 产品 | ✅ 产品 | 1.0 |
| 4 | Anthropic 提出度量前沿 AI 发展速度的新指标 | 行业 | ✅ 行业 | 1.0 |
| 5 | Google 发布 Gemini 3.8 Live 对话模型 | 模型 | ✅ 模型 | 0.96（0.02 给了产品） |
| 6 | Perplexity 便携 AI 计算机扩展到 Windows RTX | 产品 | ✅ 产品 | 1.0 |
| 7 | 某公司完成 10 亿美元 B 轮融资 | 行业 | ✅ 行业 | 1.0 |
| 8 | 欧盟通过 AI 法案执行细则 | 行业 | ✅ 行业 | 1.0 |

**8/8。** 两个细节值得展开：

**第 3 题是故意留的陷阱。** 标题里「前沿模型产品」六个字同时含「模型」和「产品」，字面匹配必错。Jev 判了产品，概率 1.0——它抓住的是「产品化交付 ≠ 模型发布」这个语义区别，而这正是我人工标注时的判断依据。

**第 5 题的 0.02 泄漏是亮点不是缺陷。** Gemini 3.8 Live 名义上是模型发布，但「边说边想边干活」的产品色彩很浓。Jev 主判模型（0.98），漏了 0.02 给产品——**这个不确定性的分布，恰好对应我人工标注时犹豫的那半秒**。概率输出让「模糊地带」从黑盒变成了可观测的东西，这是布尔值给不了的。

## 四、它该用在哪：把选择题从大模型手里拆出来

这次实验直接给了我一个接入点：更新 AI 动态时，在出表格关卡前先让 Jev 给每条候选打个 kind 建议值，我在表格里改——把「拍脑袋分类」换成「模型建议 + 人工把关」，每轮成本不到 2K tokens、一秒内。这个改动我还没落到 skill 里，但它已经在我下次说「更新AI动态」时的计划清单上了。

更一般的分工线：

| 场景 | 该用谁 | 一句话 |
|---|---|---|
| 分类/路由/是非判断 | Jev | 快、便宜、带概率 |
| 生成文本、写推理链 | 生成式模型 | Jev 一个字都不产 |
| 复杂多步规划 | 生成式模型 | System One 是直觉不是思考 |

两个使用约束文档里写得很直白，实测也验证了：**state 必须自包含**（问题里引用的上下文都得给全，模型不会去查）；**选项不能有遗漏**（Choice 只能在给定的 criteria 里选，候选没覆盖就没有「全不对」出口，需要时得自己加一个 no-match 选项）。

## 结论：好在哪、差在哪、谁该用

**好在哪：**

- **判断即原语。** 一次调用八个问题并行，0.58s、2K tokens，换成生成式模型做同样的事，又贵又慢。
- **概率可观测。** 0.02 的泄漏让我看到了模型「犹豫什么」，阈值可以按业务调。
- **强类型契约。** 返回永远是结构化的，代码直接消费，没有「请从以下选项中选择」被模型聊成小作文的风险。

**差在哪：**

- **没有解释。** 只要答案不要理由是它的设计，但排查错误时你得自己猜它为什么错。
- **选项依赖人工设计。** criteria 描述写得好不好直接影响准确率，第 3 题判对有我描述「productized offering」一半功劳。
- **生态早期。** Python/JS SDK、三种原语，工具面还薄，复杂 workflow 要自己搭。

**你该不该用它：** 你的业务里有大量「二选一/多选一/打分」且每秒调几百次 → 值得认真看；你想让 AI 写文章、聊天、推理 → 它帮不上；你像我一样维护着需要人工把关的内容流水线 → **把 Jev 放进关卡前面那一格**，把关的人会谢谢你。

---

*实测数据均来自 2026-09-23 本机调用（api.typesafe.ai，`jev-latest` → `jev-1.13.0`），请求与响应原文见文中代码块，可复现；产品定位引自 docs.typesafe.ai 官方文档。*
