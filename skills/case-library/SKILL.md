---
name: case-library 案例数据库
description: "从精选书籍中检索真实、来源可追溯的商业案例与故事，供写作与内容创作使用。当创作者需要案例研究、真实案例、商业故事、轶事、创业故事、CEO 故事、创业案例，或提出「给我一个关于…的案例」「找找…的故事」「我需要一个例子来说明…」等请求时触发。当用户提及「案例库」「故事数据库」「书籍来源的案例」，或询问创业失败、转型、领导力决策、产品发布、融资故事、公司危机、逆袭故事时也触发。返回的每条案例均可追溯到具体书籍与页码，绝无虚构。"
---

# 案例库 Case Library

---

## 中文版

### 这个 Skill 做什么

帮助创作者从精选书籍中检索**真实、可追溯的商业案例与故事**。每条案例均满足：
- **可追溯**：对应具体书籍、作者与页码
- **结构化**：按主题、领域、人物、公司、时间等标签组织
- **双语**：支持英文与原文，可选中文翻译
- **可验证**：直接从原文提取，绝无 AI 虚构

### 何时使用

当创作者需要以下内容时触发：
- 用于写作的真实案例
- 特定商业故事（创业、危机、转型、收购等）
- 涉及具体人物或公司的轶事
- 用于演示、文章或课程的案例研究

### 使用流程

#### 第一步：理解需求

解析创作者需要什么：
- **主题**：什么类型的故事？（创业、危机、转型、融资、领导力、产品、失败、逆袭、收购、扩张、竞争、文化、个人等）
- **领域**：什么行业？（科技、金融、汽车、航天、能源、社交、零售、制造、其他）
- **人物/公司**：是否有指定的人或公司？
- **时间**：是否有时代偏好？
- **基调**：励志、警示、戏剧性？

#### 第二步：加载并搜索案例库

从 skill 的 `data/` 目录读取案例文件：

```
data/
├── zero_to_one_cases.json
├── elon_musk_cases.json
└── [更多书籍]_cases.json
```

每条案例的结构示例：
```json
{
  "case_id": "唯一ID",
  "book_id": "书籍标识",
  "title_en": "英文标题",
  "title_zh": "中文标题（可选）",
  "summary_en": "英文摘要",
  "summary_zh": "中文摘要（可选）",
  "page_start": 15,
  "page_end": 17,
  "characters": ["人物A", "人物B"],
  "companies": ["公司X"],
  "year_or_period": "1995",
  "themes": ["founding", "crisis"],
  "domains": ["tech"],
  "key_quote": "原文中的 memorable 引用",
  "key_quote_zh": "引用中文（可选）"
}
```

#### 第三步：混合匹配策略

**标签筛选**（快速缩小范围）：
1. 用 `themes` 匹配请求的主题
2. 用 `domains` 匹配行业
3. 若提到具体人名/公司，匹配 `characters`、`companies`
4. 若指定时间，匹配 `year_or_period`

**语义排序**（选出最相关）：
在筛选后的候选中，按与请求的相关性排序，考虑：
- 案例叙事与创作者场景的贴合度
- 故事的戏剧性与记忆点
- 人物/公司的知名度（便于受众理解）

#### 第四步：呈现结果

返回 **2–3 条**最相关案例，格式如下：

---

**📖 案例：[标题]**
*来源：[书名] by [作者]，第 [page_start]-[page_end] 页*

[摘要]

> "[引用]"（第 [key_quote_page] 页）

**标签**：[themes] | **领域**：[domains] | **时期**：[year_or_period]
**人物**：[characters] | **公司**：[companies]

---

#### 第五步：提供延伸

呈现后可主动询问：
- 「需要我继续找同主题的更多案例吗？」
- 「我也可以换个角度找，比如竞争对手视角，或不同年代的类似故事。」
- 「需要我把这个案例改成特定格式吗（文章段落、演示稿、社媒文案）？」

### 核心规则

1. **绝不虚构案例**。只返回数据库中的案例。若无匹配，如实说明并推荐最接近的替代。
2. **必须标注来源**（书名、作者、页码）。可验证的准确性是核心价值。
3. **引用须准确**。`key_quote` 为原文引用，不得编造或篡改。
4. **尊重创作者语言**。若用中文提问，用中文呈现；若书籍为其他语言，注明原文语言。
5. **标签要准确**。不要强行把案例塞进不匹配的主题。童年个人经历不是「融资」案例，仅因当事人后来融资。

### 当前案例库

已上线：
- **Zero to One**（Peter Thiel）— 10 条案例
- **Elon Musk**（Walter Isaacson）— 12 条案例

规划中：
- Shoe Dog（Phil Knight / Nike）
- The Hard Thing About Hard Things（Ben Horowitz）
- Steve Jobs（Walter Isaacson）
- 更多 CEO 传记与商业史

### 数据流程（添加新书）

使用预处理脚本将新书加入案例库：

```bash
python scripts/extract_cases.py \
  --input /path/to/raw.json \
  --output data/[book_id]_cases.json \
  --book-id [book_id] \
  --api-key $ANTHROPIC_API_KEY
```

脚本流程：
1. 加载按页 JSON（格式：`{"pages": [{"page_index": N, "content": "..."}]}`）
2. 过滤非正文页（目录、图片、版权页等）
3. 以 8 页滑动窗口调用 Claude API 提取案例
4. 去重并合并跨窗口案例
5. 输出结构化案例，保留页码级可追溯性

### 中文翻译字段（可选 `*_zh`）

为支持双语展示，可为任意案例添加可选 `*_zh` 字段。当 `lang=zh` 且字段存在时，门户展示中文。

**Zero to One / arc 格式：**
- `title_zh`, `before_state_zh`, `trigger_zh`, `action_zh`, `result_zh`, `after_state_zh`
- `hard_numbers_zh`（数组）, `concepts_zh`（数组）
- `source_excerpt_zh`
- `quotes[]` 中每项可加 `text_zh`

**Elon Musk / summary 格式：**
- `title_zh`, `summary_zh`, `key_quote_zh`

---

## English Version

### What this skill does

This skill helps creators find **real, accurate business cases and stories** extracted from curated books. Every case is:
- **Traceable**: tied to a specific book, author, and page range
- **Structured**: tagged by theme, domain, characters, companies, and time period
- **Bilingual**: summaries available in English and original language (optional Chinese)
- **Verified**: extracted directly from source text, never fabricated by AI

### When to use this skill

Trigger whenever a creator needs:
- A real-world example to illustrate a point in their writing
- A specific business story (founding, crisis, pivot, acquisition, etc.)
- An anecdote involving a named person or company
- A case study for a presentation, article, or course

### How it works

#### Step 1: Understand the request

Parse what the creator needs:
- **Theme**: What kind of story? (founding, crisis, pivot, fundraising, leadership, product, failure, comeback, acquisition, scaling, competition, culture, personal)
- **Domain**: What industry? (tech, finance, automotive, space, energy, social_media, retail, manufacturing, other)
- **Characters/Companies**: Any specific people or companies?
- **Time period**: Any era preference?
- **Tone**: Inspirational? Cautionary? Dramatic?

#### Step 2: Load and search the case database

Read the case database files from the skill's `data/` directory:

```
data/
├── zero_to_one_cases.json
├── elon_musk_cases.json
└── [future_book]_cases.json
```

Each case has this structure:
```json
{
  "case_id": "unique_id",
  "book_id": "book_identifier",
  "title_en": "Short English title",
  "title_zh": "Chinese title (optional)",
  "summary_en": "2-4 sentence English summary",
  "summary_zh": "Chinese summary (optional)",
  "page_start": 15,
  "page_end": 17,
  "characters": ["Person A", "Person B"],
  "companies": ["Company X"],
  "year_or_period": "1995",
  "themes": ["founding", "crisis"],
  "domains": ["tech"],
  "key_quote": "A memorable quote from the source",
  "key_quote_zh": "Quote in Chinese (optional)"
}
```

#### Step 3: Match cases using hybrid approach

**Tag filtering** (fast, narrow the pool):
1. Match `themes` against the creator's requested theme
2. Match `domains` against the requested industry
3. Match `characters` and `companies` if specific names are mentioned
4. Match `year_or_period` if a time range is specified

**Semantic ranking** (smart, pick the best):
After tag filtering narrows candidates to ~10-20, rank by relevance to the creator's specific request. Consider:
- How closely the case's narrative matches the creator's scenario
- How dramatic/memorable the story is
- How well-known the characters/companies are (for audience recognition)

#### Step 4: Present results

Return the **top 2-3 cases** in this format:

---

**📖 Case: [title_en]**
*Source: [book_title] by [book_author], pp. [page_start]-[page_end]*

[summary_en]

> "[key_quote]" (p. [key_quote_page])

**Tags**: [themes] | **Domain**: [domains] | **Period**: [year_or_period]
**People**: [characters] | **Companies**: [companies]

---

#### Step 5: Offer to go deeper

After presenting cases, offer:
- "Want me to find more cases on this theme?"
- "I can also look for cases from a different angle — e.g., the competitor's perspective, or a similar story from a different era."
- "Need me to adapt this case into a specific format (article paragraph, presentation slide, social media post)?"

### Critical rules

1. **NEVER fabricate cases**. Only return cases from the database. If no matching case exists, say so honestly and suggest the closest alternatives.
2. **ALWAYS include source attribution** (book, author, page numbers). This is the core value proposition — verifiable accuracy.
3. **Quote carefully**. The `key_quote` field contains verified quotes from the source. Do not invent or modify quotes.
4. **Respect the creator's language**. If they write in Chinese, present cases in Chinese. If the book is in a different language, note that the original text is in [language].
5. **Tag accuracy matters**. Don't stretch a case to fit a theme it doesn't match. A "personal" story about childhood is not a "fundraising" case just because the person later raised funds.

### Available case databases

Currently available:
- **Zero to One** by Peter Thiel — 10 cases
- **Elon Musk** by Walter Isaacson — 12 cases

Coming soon:
- Shoe Dog (Phil Knight / Nike)
- The Hard Thing About Hard Things (Ben Horowitz)
- Steve Jobs (Walter Isaacson)
- More CEO biographies and business histories

### Data pipeline (for adding new books)

To add a new book to the case library, use the preprocessing script:

```bash
python scripts/extract_cases.py \
  --input /path/to/raw.json \
  --output data/[book_id]_cases.json \
  --book-id [book_id] \
  --api-key $ANTHROPIC_API_KEY
```

The script:
1. Loads the per-page JSON (format: `{"pages": [{"page_index": N, "content": "..."}]}`)
2. Filters out non-content pages (TOC, photos, credits)
3. Sends 8-page sliding windows to Claude API for case extraction
4. Deduplicates and merges cross-window cases
5. Outputs structured cases with page-level traceability

### Chinese translation schema (optional `*_zh` fields)

For bilingual display, add optional `*_zh` fields to any case. The portal shows Chinese when `lang=zh` and the field exists.

**Zero to One / arc format:**
- `title_zh`, `before_state_zh`, `trigger_zh`, `action_zh`, `result_zh`, `after_state_zh`
- `hard_numbers_zh` (array), `concepts_zh` (array)
- `source_excerpt_zh`
- In `quotes[]`: add `text_zh` per quote

**Elon Musk / summary format:**
- `title_zh`, `summary_zh`, `key_quote_zh`
