/**
 * Case Library data loader.
 * Normalizes zero_to_one (V2 arc schema) and elon_musk (V1 summary schema) into a unified display format.
 */
import zeroToOneData from "../../../skills/case-library/data/zero_to_one_cases.json";
import elonMuskData from "../../../skills/case-library/data/elon_musk_cases.json";

function normalizeZeroToOne(c, bookId, bookTitle, bookColor) {
  return {
    id: c.case_id,
    book: bookId,
    title: c.title,
    title_zh: c.title_zh || "",
    who: c.who || [],
    company: c.company || [],
    when: c.when || "",
    where: c.where || "",
    before: c.before_state || "",
    before_zh: c.before_state_zh || "",
    trigger: c.trigger || "",
    trigger_zh: c.trigger_zh || "",
    action: c.action || "",
    action_zh: c.action_zh || "",
    result: c.result || "",
    result_zh: c.result_zh || "",
    after: c.after_state || "",
    after_zh: c.after_state_zh || "",
    numbers: c.hard_numbers || [],
    numbers_zh: c.hard_numbers_zh || [],
    quotes: (c.quotes || []).map((q) => ({
      text: q.text,
      text_zh: q.text_zh || "",
      speaker: q.speaker,
      page: q.page,
    })),
    themes: c.themes || [],
    domains: c.domains || [],
    function: c.narrative_function || [],
    concepts: c.concepts || [],
    concepts_zh: c.concepts_zh || [],
    pages: c.page_start != null && c.page_end != null ? `${c.page_start}-${c.page_end}` : "",
    excerpt: c.source_excerpt || "",
    excerpt_zh: c.source_excerpt_zh || "",
    summary: null,
    summary_zh: "",
    bookTitle,
    bookColor,
  };
}

function normalizeElonMusk(c, bookId, bookTitle, bookColor) {
  return {
    id: c.case_id,
    book: bookId,
    title: c.title_en || c.title_original,
    title_zh: c.title_zh || "",
    who: c.characters || [],
    company: c.companies || [],
    when: c.year_or_period || "",
    where: "",
    before: "",
    before_zh: "",
    trigger: "",
    trigger_zh: "",
    action: "",
    action_zh: "",
    result: "",
    result_zh: "",
    after: "",
    after_zh: "",
    numbers: [],
    numbers_zh: [],
    quotes: c.key_quote
      ? [{
          text: c.key_quote,
          text_zh: c.key_quote_zh || "",
          speaker: "",
          page: c.key_quote_page || c.page_start,
        }]
      : [],
    themes: c.themes || [],
    domains: c.domains || [],
    function: [],
    concepts: [],
    concepts_zh: [],
    pages: c.page_start != null && c.page_end != null ? `${c.page_start}-${c.page_end}` : "",
    excerpt: "",
    excerpt_zh: "",
    summary: c.summary_en || c.summary_original,
    summary_zh: c.summary_zh || "",
    bookTitle,
    bookColor,
  };
}

const BOOKS = [
  {
    id: zeroToOneData.book_id,
    title: zeroToOneData.book_title,
    author: zeroToOneData.book_author,
    color: "#2563eb",
    cases: zeroToOneData.total_cases,
  },
  {
    id: elonMuskData.book_id,
    title: elonMuskData.book_title,
    author: elonMuskData.book_author,
    color: "#b45309",
    cases: elonMuskData.total_cases,
  },
];

const ALL_CASES = [
  ...zeroToOneData.cases.map((c) =>
    normalizeZeroToOne(c, zeroToOneData.book_id, zeroToOneData.book_title, "#2563eb")
  ),
  ...elonMuskData.cases.map((c) =>
    normalizeElonMusk(c, elonMuskData.book_id, elonMuskData.book_title, "#b45309")
  ),
];

export { BOOKS, ALL_CASES };
