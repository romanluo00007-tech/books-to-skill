#!/usr/bin/env python3
"""
Case Library Preprocessor — 案例抽取预处理脚本
==============================================
从按页抽取的书籍 JSON 中，使用 Claude API 提取结构化的商业案例（V2 schema）。

用法：
    python extract_cases.py --input raw.json --output cases.json [--book-id XXX]

流程：
    1. 加载 raw.json（格式：{"pages": [{"page_index": N, "content": "..."}]}）
    2. 过滤无效页（目录、版权、照片说明等）
    3. 按滑动窗口分组（8页一组，重叠2页）
    4. 每组送 Claude API 提取案例（V2 prompt）
    5. 去重 + 合并跨窗口的相同案例（V2 字段）
    6. 输出结构化 cases.json
"""

import json
import argparse
import hashlib
import time
import os
from typing import Optional

# ──────────────────────────────────────────────
# 配置
# ──────────────────────────────────────────────
WINDOW_SIZE = 8       # 每次送入的页数
OVERLAP = 2           # 窗口重叠页数
MIN_PAGE_CHARS = 80   # 低于此字数的页面被视为非正文（目录、照片说明等）
API_MODEL = "claude-sonnet-4-20250514"
API_URL = "https://api.anthropic.com/v1/messages"
MAX_RETRIES = 3
RETRY_DELAY = 5       # 秒

# ──────────────────────────────────────────────
# V2 提取 Prompt
# ──────────────────────────────────────────────

EXTRACTION_SYSTEM_PROMPT = """You are a precise case study extractor for business books.

Your job is to identify CONCRETE STORIES and SPECIFIC ANECDOTES from the provided book pages.
A "case" is a specific event, decision, turning point, or episode involving real people and companies.

CRITICAL RULES:
1. ONLY extract information EXPLICITLY stated in the text. Never infer or fabricate.
2. Each case MUST have specific page numbers.
3. If the text is non-English, write story fields in BOTH English AND original language.
4. Prefer MORE cases with SHORTER summaries over fewer cases with long ones.
5. Every field must come from what's on the page — if you don't see a number, don't invent one.

DO NOT extract:
- Table of contents, chapter titles, photo captions, acknowledgments
- General philosophy or arguments without a specific event
- Background exposition that doesn't constitute a "story with actors"

Respond ONLY with a JSON array. No markdown, no explanation. If no cases found, respond with [].

Each case object must have EXACTLY these fields:

{
  "title": "Short headline, max 15 words, English",
  "who": ["Real names of people involved"],
  "company": ["Companies involved, empty array if none"],
  "when": "Year, range, or era, e.g. '2008' or 'early 1990s'",
  "where": "Location or setting",

  "before_state": "1-2 sentences. What was the situation RIGHT BEFORE this story? Sets the stakes.",
  "trigger": "1-2 sentences. The inciting event — what kicked things off.",
  "action": "2-4 sentences. What the protagonist DID. The core narrative.",
  "result": "1-2 sentences. Immediate outcome.",
  "after_state": "1-2 sentences. Where things stood after. The contrast with before_state.",

  "hard_numbers": ["Specific citable data: dollars, dates, percentages, headcounts. Only from the text."],

  "quotes": [
    {
      "text": "Exact quote from the book, in original language",
      "translation": "English translation if original is not English, otherwise null",
      "speaker": "Who said it",
      "page": 42
    }
  ],

  "themes": ["from: founding, fundraising, crisis, pivot, scaling, competition, leadership, product, culture, acquisition, failure, comeback, personal, negotiation, hiring, firing, fraud"],
  "domains": ["from: tech, finance, automotive, space, energy, social_media, retail, manufacturing, healthcare, media, transport, real_estate, other"],
  "narrative_function": ["from: origin_myth, turning_point, contrast_pair, escalation, resolution, comic_relief, foreshadowing"],
  "concepts": ["Free-form abstract concepts this case illustrates, e.g. 'market timing', 'founder resilience'"],

  "page_start": 42,
  "page_end": 44,
  "source_excerpt": "The most relevant 2-4 sentences VERBATIM from the book. This is the evidence anchor.",
  "original_language": "en"
}

IMPORTANT on quotes:
- Include 1-3 quotes per case, from DIFFERENT speakers when possible
- Only include quotes that are DIRECT SPEECH marked with quotation marks in the original text
- Include the page number for each quote

IMPORTANT on hard_numbers:
- Only include numbers explicitly stated in the text
- Format as "number — what it refers to", e.g. "$1.5 billion — eBay acquisition of PayPal"
- Dates count as hard numbers if they anchor the timeline

IMPORTANT on source_excerpt:
- This must be VERBATIM text from the book, not your summary
- Pick the most vivid/specific passage, not the most general one
- Keep it to 2-4 sentences maximum"""

# V2 案例 schema 中的列表字段（合并时取并集去重）
V2_LIST_FIELDS = ("who", "company", "hard_numbers", "themes", "domains", "narrative_function", "concepts")

# V2 案例 schema 中的叙事字段（合并时保留更长的）
V2_NARRATIVE_FIELDS = ("before_state", "trigger", "action", "result", "after_state", "source_excerpt")


def call_claude_api(pages_text: str, api_key: Optional[str] = None) -> list:
    """调用 Claude API 提取案例"""
    import urllib.request
    import urllib.error

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key or os.environ.get("ANTHROPIC_API_KEY", ""),
        "anthropic-version": "2023-06-01",
    }

    body = json.dumps({
        "model": API_MODEL,
        "max_tokens": 4096,
        "system": EXTRACTION_SYSTEM_PROMPT,
        "messages": [
            {
                "role": "user",
                "content": f"Extract all concrete business cases/stories from these book pages:\n\n{pages_text}"
            }
        ]
    })

    req = urllib.request.Request(API_URL, data=body.encode(), headers=headers)

    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode())
                text = ""
                for block in data.get("content", []):
                    if block.get("type") == "text":
                        text += block["text"]
                # 清理并解析 JSON
                text = text.strip()
                if text.startswith("```"):
                    text = text.split("\n", 1)[1]
                    if text.endswith("```"):
                        text = text[:-3]
                    text = text.strip()
                return json.loads(text)
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                print(f"  [重试 {attempt+1}/{MAX_RETRIES}] HTTP {e.code}, 等待 {RETRY_DELAY}s...")
                time.sleep(RETRY_DELAY * (attempt + 1))
            else:
                print(f"  [错误] HTTP {e.code}: {e.read().decode()[:200]}")
                return []
        except json.JSONDecodeError as e:
            print(f"  [警告] JSON 解析失败: {e}. 原始文本: {text[:200]}...")
            return []
        except Exception as e:
            print(f"  [错误] {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
            else:
                return []
    return []


# ──────────────────────────────────────────────
# 页面预处理
# ──────────────────────────────────────────────

def load_book(filepath: str) -> tuple[list, dict]:
    """加载 raw.json 并返回 (有效页面列表, 元数据)"""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    pages = data.get("pages", [])
    print(f"📖 加载了 {len(pages)} 页原始数据")

    # 提取元数据（若有）
    meta = {k: data[k] for k in ("book_title", "book_author", "book_language") if k in data}

    # 过滤无效页面
    valid = []
    skipped_types = {"short": 0, "toc": 0, "credits": 0}

    for p in pages:
        content = p.get("content", "").strip()
        idx = p.get("page_index", 0)

        if len(content) < MIN_PAGE_CHARS:
            skipped_types["short"] += 1
            continue

        colon_count = content.count(":")
        line_count = content.count("\n") + 1
        if colon_count > 5 and colon_count / max(line_count, 1) > 0.4:
            skipped_types["toc"] += 1
            continue

        credit_signals = ["isbn", "copyright", "editora", "publisher", "all rights reserved",
                          "créditos", "sobre o autor", "agradecimentos"]
        if any(sig in content.lower() for sig in credit_signals) and len(content) < 500:
            skipped_types["credits"] += 1
            continue

        valid.append({"page_index": idx, "content": content})

    print(f"✅ 有效页面: {len(valid)} (跳过: 短页={skipped_types['short']}, "
          f"目录={skipped_types['toc']}, 版权={skipped_types['credits']})")
    return valid, meta


def create_windows(pages: list) -> list:
    """创建滑动窗口"""
    windows = []
    step = WINDOW_SIZE - OVERLAP
    for i in range(0, len(pages), step):
        window = pages[i:i + WINDOW_SIZE]
        if len(window) >= 3:
            windows.append(window)
    print(f"🪟 创建了 {len(windows)} 个滑动窗口 (大小={WINDOW_SIZE}, 重叠={OVERLAP})")
    return windows


def format_window_text(window: list) -> str:
    """格式化窗口内的页面文本，保留页码标记"""
    parts = []
    for p in window:
        parts.append(f"--- PAGE {p['page_index']} ---\n{p['content']}")
    return "\n\n".join(parts)


# ──────────────────────────────────────────────
# 案例去重与合并（V2 schema）
# ──────────────────────────────────────────────

def case_signature(case: dict) -> str:
    """生成案例的唯一签名，用于去重。V2 使用 title + page_start"""
    key = f"{case.get('page_start', 0)}_{case.get('title', '').lower()[:30]}"
    return hashlib.md5(key.encode()).hexdigest()[:12]


def _merge_list_field(existing: dict, case: dict, field: str):
    """合并列表字段：取并集，保持顺序，去重"""
    a = existing.get(field, []) or []
    b = case.get(field, []) or []
    seen = set()
    merged = []
    for x in a + b:
        # 列表元素可能是 str 或 dict（如 quotes）
        key = json.dumps(x, sort_keys=True) if isinstance(x, dict) else str(x)
        if key not in seen:
            seen.add(key)
            merged.append(x)
    existing[field] = merged


def _merge_quotes(existing: dict, case: dict):
    """合并 quotes：按 text+page 去重"""
    a = existing.get("quotes", []) or []
    b = case.get("quotes", []) or []
    seen = set()
    merged = []
    for q in a + b:
        key = (q.get("text", ""), q.get("page"))
        if key not in seen:
            seen.add(key)
            merged.append(q)
    existing["quotes"] = merged


def merge_cases(all_cases: list) -> list:
    """合并来自不同窗口的重复案例。适配 V2 schema。"""
    seen = {}
    merged = []

    for case in all_cases:
        sig = case_signature(case)
        if sig in seen:
            existing = seen[sig]

            # 1. 扩展页码范围
            existing["page_start"] = min(existing.get("page_start", 999), case.get("page_start", 999))
            existing["page_end"] = max(existing.get("page_end", 0), case.get("page_end", 0))

            # 2. 叙事字段：保留更长的
            for field in V2_NARRATIVE_FIELDS:
                new_val = case.get(field, "") or ""
                old_val = existing.get(field, "") or ""
                if len(new_val) > len(old_val):
                    existing[field] = new_val

            # 3. 列表字段：合并去重
            for field in V2_LIST_FIELDS:
                _merge_list_field(existing, case, field)

            # 4. quotes 特殊处理（结构为 [{text, translation, speaker, page}]）
            _merge_quotes(existing, case)

            # 5. 标量字段：若已有则保留，否则取新值
            for field in ("title", "when", "where", "original_language"):
                if field not in existing or not existing.get(field):
                    existing[field] = case.get(field)
        else:
            seen[sig] = case
            merged.append(case)

    print(f"🔄 去重: {len(all_cases)} → {len(merged)} 条案例")
    return merged


# ──────────────────────────────────────────────
# 主流程
# ──────────────────────────────────────────────

def process_book(input_path: str, output_path: str, book_id: str = None,
                 api_key: str = None, dry_run: bool = False):
    """处理一本书的完整流程"""

    pages, meta = load_book(input_path)
    if not pages:
        print("❌ 没有有效页面")
        return

    windows = create_windows(pages)

    if not book_id:
        book_id = hashlib.md5(input_path.encode()).hexdigest()[:16]

    all_cases = []
    for i, window in enumerate(windows):
        page_range = f"{window[0]['page_index']}-{window[-1]['page_index']}"
        print(f"\n📦 窗口 {i+1}/{len(windows)} (页 {page_range})...")

        if dry_run:
            print("  [DRY RUN] 跳过 API 调用")
            continue

        text = format_window_text(window)
        cases = call_claude_api(text, api_key)

        if cases:
            print(f"  ✅ 提取到 {len(cases)} 个案例")
            for c in cases:
                c["_window"] = i
            all_cases.extend(cases)
        else:
            print("  ⚠️ 该窗口未提取到案例")

        if i < len(windows) - 1:
            time.sleep(1)

    if dry_run:
        print(f"\n[DRY RUN] 共 {len(windows)} 个窗口待处理")
        return

    merged = merge_cases(all_cases)

    for i, case in enumerate(merged):
        case["case_id"] = f"{book_id}_{i+1:03d}"
        case["book_id"] = book_id
        case.pop("_window", None)

    output = {
        "book_id": book_id,
        "total_cases": len(merged),
        "extraction_date": time.strftime("%Y-%m-%d"),
        "source_pages_range": f"{pages[0]['page_index']}-{pages[-1]['page_index']}",
        **meta,
        "cases": merged
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 完成！提取了 {len(merged)} 个案例 → {output_path}")
    return output


def main():
    parser = argparse.ArgumentParser(description="从书籍 JSON 中提取商业案例（V2 schema）")
    parser.add_argument("--input", required=True, help="输入的 raw.json 文件路径")
    parser.add_argument("--output", required=True, help="输出的 cases.json 文件路径")
    parser.add_argument("--book-id", default=None, help="书籍ID（默认从文件名生成）")
    parser.add_argument("--api-key", default=None, help="Anthropic API Key（或用环境变量 ANTHROPIC_API_KEY）")
    parser.add_argument("--dry-run", action="store_true", help="不调用API，仅测试数据加载和窗口划分")
    args = parser.parse_args()

    process_book(args.input, args.output, args.book_id, args.api_key, args.dry_run)


if __name__ == "__main__":
    main()
