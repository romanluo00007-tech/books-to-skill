---
name: case-library
description: "Retrieve real, source-verified business cases and stories from curated book libraries for use in writing and content creation. Use this skill whenever a creator asks for a case study, real-world example, business story, anecdote, founding story, CEO story, entrepreneurship example, or any request like 'give me a case about...', 'find me a story about...', 'I need an example of...', 'what's a good case for illustrating...'. Also trigger when users mention 'case library', 'story database', 'book-sourced example', or ask about startup failures, pivots, leadership decisions, product launches, fundraising stories, company crises, or comeback stories. Every case returned is traceable to a specific book and page range — never fabricated."
---

# Case Library — Source-Verified Business Stories for Creators

## What this skill does

This skill helps creators find **real, accurate business cases and stories** extracted from curated books. Every case is:
- **Traceable**: tied to a specific book, author, and page range
- **Structured**: tagged by theme, domain, characters, companies, and time period
- **Bilingual**: summaries available in English and original language
- **Verified**: extracted directly from source text, never fabricated by AI

## When to use this skill

Trigger whenever a creator needs:
- A real-world example to illustrate a point in their writing
- A specific business story (founding, crisis, pivot, acquisition, etc.)
- An anecdote involving a named person or company
- A case study for a presentation, article, or course

## How it works

### Step 1: Understand the request

Parse what the creator needs:
- **Theme**: What kind of story? (founding, crisis, pivot, fundraising, leadership, product, failure, comeback, acquisition, scaling, competition, culture, personal)
- **Domain**: What industry? (tech, finance, automotive, space, energy, social_media, retail, manufacturing, other)
- **Characters/Companies**: Any specific people or companies?
- **Time period**: Any era preference?
- **Tone**: Inspirational? Cautionary? Dramatic?

### Step 2: Load and search the case database

Read the case database files from the skill's `data/` directory:

```
/path/to/case-library/data/
├── sample_cases.json          # Demo: Elon Musk biography cases
├── [future_book]_cases.json   # More books to come
└── index.json                 # Master index (when multiple books exist)
```

Use `view` tool to read the relevant case files. Each case has this structure:
```json
{
  "case_id": "unique_id",
  "book_id": "book_identifier",
  "title_en": "Short English title",
  "summary_en": "2-4 sentence English summary",
  "summary_original": "Summary in book's original language",
  "page_start": 15,
  "page_end": 17,
  "characters": ["Person A", "Person B"],
  "companies": ["Company X"],
  "year_or_period": "1995",
  "themes": ["founding", "crisis"],
  "domains": ["tech"],
  "key_quote": "A memorable quote from the source",
  "key_quote_page": 16
}
```

### Step 3: Match cases using hybrid approach

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

### Step 4: Present results

Return the **top 2-3 cases** in this format:

---

**📖 Case: [title_en]**
*Source: [book_title] by [book_author], pp. [page_start]-[page_end]*

[summary_en]

> "[key_quote]" (p. [key_quote_page])

**Tags**: [themes] | **Domain**: [domains] | **Period**: [year_or_period]
**People**: [characters] | **Companies**: [companies]

---

### Step 5: Offer to go deeper

After presenting cases, offer:
- "Want me to find more cases on this theme?"
- "I can also look for cases from a different angle — e.g., the competitor's perspective, or a similar story from a different era."
- "Need me to adapt this case into a specific format (article paragraph, presentation slide, social media post)?"

## Critical rules

1. **NEVER fabricate cases**. Only return cases from the database. If no matching case exists, say so honestly and suggest the closest alternatives.
2. **ALWAYS include source attribution** (book, author, page numbers). This is the core value proposition — verifiable accuracy.
3. **Quote carefully**. The `key_quote` field contains verified quotes from the source. Do not invent or modify quotes.
4. **Respect the creator's language**. If they write in Chinese, present cases in Chinese (use summary_en as the primary content, translate naturally). If the book is in a different language, note that the original text is in [language].
5. **Tag accuracy matters**. Don't stretch a case to fit a theme it doesn't match. A "personal" story about childhood is not a "fundraising" case just because the person later raised funds.

## Available case databases

Currently available (demo):
- **Elon Musk** by Walter Isaacson — 12 cases covering founding stories, personal adversity, pivots, acquisitions, and leadership moments (pp. 15-73, Portuguese edition)

Coming soon:
- Shoe Dog (Phil Knight / Nike)
- Zero to One (Peter Thiel)
- The Hard Thing About Hard Things (Ben Horowitz)
- Steve Jobs (Walter Isaacson)
- More CEO biographies and business histories

## Data pipeline (for adding new books)

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

## Chinese translation schema (optional `*_zh` fields)

For bilingual display, add optional `*_zh` fields to any case. The portal shows Chinese when `lang=zh` and the field exists.

**Zero to One / arc format:**
- `title_zh`, `before_state_zh`, `trigger_zh`, `action_zh`, `result_zh`, `after_state_zh`
- `hard_numbers_zh` (array), `concepts_zh` (array)
- `source_excerpt_zh`
- In `quotes[]`: add `text_zh` per quote

**Elon Musk / summary format:**
- `title_zh`, `summary_zh`, `key_quote_zh`
