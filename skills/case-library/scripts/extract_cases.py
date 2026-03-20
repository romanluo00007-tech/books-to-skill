#!/usr/bin/env python3
"""
Case Library Preprocessor — 案例抽取预处理脚本
==============================================
从按页抽取的书籍 JSON 中，使用 Claude API 提取结构化的商业案例。

用法：
    python extract_cases.py --input raw.json --output cases.json [--book-id XXX] [--lang auto]

流程：
    1. 加载 raw.json（格式：{"pages": [{"page_index": N, "content": "..."}]}）
    2. 过滤无效页（目录、版权、照片说明等）
    3. 按滑动窗口分组（8页一组，重叠2页）
    4. 每组送 Claude API 提取案例
    5. 去重 + 合并跨窗口的相同案例
    6. 输出结构化 cases.json
"""

import json
import argparse
import hashlib
import time
import sys
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
# Claude API 调用
# ──────────────────────────────────────────────

EXTRACTION_SYSTEM_PROMPT = """You are a precise case study extractor for business and entrepreneurship books.

Your job is to identify CONCRETE STORIES and SPECIFIC ANECDOTES from the provided book pages.
A "case" is a specific event, decision, turning point, or episode involving real people and companies.

CRITICAL RULES:
1. ONLY extract information that is EXPLICITLY stated in the provided text. Never infer, assume, or fabricate details.
2. Each case MUST have specific page numbers where the information appears.
3. The summary must be faithful to the original text — use the book's own facts, names, dates, and details.
4. If the text is in a non-English language, write the case summary in BOTH the original language AND English.
5. Tag each case with relevant categories from this taxonomy:
   - THEME: founding, fundraising, crisis, pivot, scaling, competition, leadership, product, culture, acquisition, failure, comeback, personal
   - DOMAIN: tech, finance, manufacturing, energy, space, automotive, social_media, retail, other
6. Extract the KEY QUOTE if there is a memorable direct quote in the original text (keep it under 30 words, in original language).

DO NOT extract:
- Table of contents, chapter titles, photo captions
- General philosophical musings without a specific event
- Background information that doesn't constitute a "story"

Respond ONLY with a JSON array. No markdown, no explanation. If no cases are found, respond with [].

Each case object must have exactly these fields:
{
  "title_en": "Short English title (max 10 words)",
  "title_original": "Short title in the book's language (if not English, otherwise same as title_en)",
  "summary_en": "2-4 sentence English summary of the specific event/story",
  "summary_original": "2-4 sentence summary in the book's language (if not English, otherwise same as summary_en)",
  "page_start": <first page number where this case appears>,
  "page_end": <last page number where this case appears>,
  "characters": ["List", "of", "people", "involved"],
  "companies": ["List", "of", "companies", "mentioned"],
  "year_or_period": "e.g. '1995' or '1989-1990' or 'early 1980s'",
  "themes": ["from the taxonomy above"],
  "domains": ["from the taxonomy above"],
  "key_quote": "A memorable direct quote from the text, or null",
  "key_quote_page": <page number of the quote, or null>
}"""


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

def load_book(filepath: str) -> list:
    """加载 raw.json 并返回有效页面列表"""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    pages = data.get("pages", [])
    print(f"📖 加载了 {len(pages)} 页原始数据")

    # 过滤无效页面
    valid = []
    skipped_types = {"short": 0, "toc": 0, "credits": 0}

    for p in pages:
        content = p.get("content", "").strip()
        idx = p.get("page_index", 0)

        # 跳过太短的页面（通常是照片说明、章节标题等）
        if len(content) < MIN_PAGE_CHARS:
            skipped_types["short"] += 1
            continue

        # 跳过目录页（包含大量章节编号/冒号的页面）
        colon_count = content.count(":")
        line_count = content.count("\n") + 1
        if colon_count > 5 and colon_count / max(line_count, 1) > 0.4:
            skipped_types["toc"] += 1
            continue

        # 跳过版权/出版信息页
        credit_signals = ["isbn", "copyright", "editora", "publisher", "all rights reserved",
                          "créditos", "sobre o autor", "agradecimentos"]
        if any(sig in content.lower() for sig in credit_signals) and len(content) < 500:
            skipped_types["credits"] += 1
            continue

        valid.append({"page_index": idx, "content": content})

    print(f"✅ 有效页面: {len(valid)} (跳过: 短页={skipped_types['short']}, "
          f"目录={skipped_types['toc']}, 版权={skipped_types['credits']})")
    return valid


def create_windows(pages: list) -> list:
    """创建滑动窗口"""
    windows = []
    step = WINDOW_SIZE - OVERLAP
    for i in range(0, len(pages), step):
        window = pages[i:i + WINDOW_SIZE]
        if len(window) >= 3:  # 至少3页才有意义
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
# 案例去重与合并
# ──────────────────────────────────────────────

def case_signature(case: dict) -> str:
    """生成案例的唯一签名，用于去重"""
    key = f"{case.get('page_start', 0)}_{case.get('title_en', '').lower()[:30]}"
    return hashlib.md5(key.encode()).hexdigest()[:12]


def merge_cases(all_cases: list) -> list:
    """合并来自不同窗口的重复案例"""
    seen = {}
    merged = []

    for case in all_cases:
        sig = case_signature(case)
        if sig in seen:
            # 合并：扩展页码范围，保留更长的摘要
            existing = seen[sig]
            existing["page_start"] = min(existing["page_start"], case.get("page_start", 999))
            existing["page_end"] = max(existing["page_end"], case.get("page_end", 0))
            # 如果新摘要更长，替换
            if len(case.get("summary_en", "")) > len(existing.get("summary_en", "")):
                existing["summary_en"] = case["summary_en"]
                existing["summary_original"] = case.get("summary_original", "")
            # 合并人物和公司列表
            existing["characters"] = list(set(existing.get("characters", []) + case.get("characters", [])))
            existing["companies"] = list(set(existing.get("companies", []) + case.get("companies", [])))
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

    # 1. 加载
    pages = load_book(input_path)
    if not pages:
        print("❌ 没有有效页面")
        return

    # 2. 创建窗口
    windows = create_windows(pages)

    # 3. 自动生成 book_id
    if not book_id:
        book_id = hashlib.md5(input_path.encode()).hexdigest()[:16]

    # 4. 逐窗口提取案例
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
                c["_window"] = i  # 标记来源窗口（调试用）
            all_cases.extend(cases)
        else:
            print("  ⚠️ 该窗口未提取到案例")

        # 避免速率限制
        if i < len(windows) - 1:
            time.sleep(1)

    if dry_run:
        print(f"\n[DRY RUN] 共 {len(windows)} 个窗口待处理")
        return

    # 5. 去重合并
    merged = merge_cases(all_cases)

    # 6. 添加元数据并生成ID
    for i, case in enumerate(merged):
        case["case_id"] = f"{book_id}_{i+1:03d}"
        case["book_id"] = book_id
        case.pop("_window", None)

    # 7. 构建输出
    output = {
        "book_id": book_id,
        "total_cases": len(merged),
        "extraction_date": time.strftime("%Y-%m-%d"),
        "source_pages_range": f"{pages[0]['page_index']}-{pages[-1]['page_index']}",
        "cases": merged
    }

    # 8. 保存
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 完成！提取了 {len(merged)} 个案例 → {output_path}")
    return output


def main():
    parser = argparse.ArgumentParser(description="从书籍 JSON 中提取商业案例")
    parser.add_argument("--input", required=True, help="输入的 raw.json 文件路径")
    parser.add_argument("--output", required=True, help="输出的 cases.json 文件路径")
    parser.add_argument("--book-id", default=None, help="书籍ID（默认从文件名生成）")
    parser.add_argument("--api-key", default=None, help="Anthropic API Key（或用环境变量 ANTHROPIC_API_KEY）")
    parser.add_argument("--dry-run", action="store_true", help="不调用API，仅测试数据加载和窗口划分")
    args = parser.parse_args()

    process_book(args.input, args.output, args.book_id, args.api_key, args.dry_run)


if __name__ == "__main__":
    main()
