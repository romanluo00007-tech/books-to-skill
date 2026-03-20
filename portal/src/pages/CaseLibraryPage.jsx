import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BOOKS, ALL_CASES } from "../data/caseLibraryData";

const THEME_COLORS = {
  crisis: "#dc2626",
  fundraising: "#7c3aed",
  founding: "#059669",
  competition: "#ea580c",
  failure: "#b91c1c",
  scaling: "#0284c7",
  product: "#7c3aed",
  leadership: "#b45309",
  personal: "#6b7280",
  pivot: "#0891b2",
  comeback: "#16a34a",
  acquisition: "#8b5cf6",
};

// 主题/领域的中英标签
const THEME_LABELS = {
  zh: {
    crisis: "危机", fundraising: "融资", founding: "创业", competition: "竞争",
    failure: "失败", scaling: "扩张", product: "产品", leadership: "领导力",
    personal: "个人", pivot: "转型", comeback: "逆袭", acquisition: "收购",
  },
  en: {
    crisis: "crisis", fundraising: "fundraising", founding: "founding", competition: "competition",
    failure: "failure", scaling: "scaling", product: "product", leadership: "leadership",
    personal: "personal", pivot: "pivot", comeback: "comeback", acquisition: "acquisition",
  },
};
const DOMAIN_LABELS = {
  zh: {
    tech: "科技", finance: "金融", retail: "零售", energy: "能源",
    automotive: "汽车", space: "航天", social_media: "社交", other: "其他",
  },
  en: {
    tech: "tech", finance: "finance", retail: "retail", energy: "energy",
    automotive: "automotive", space: "space", social_media: "social_media", other: "other",
  },
};

const T = {
  zh: {
    backLink: "← 返回 Books to Skill",
    title: "案例库",
    subtitle: "来源可追溯的商业故事，供创作者使用",
    desc: "每个案例均可追溯到具体书籍和页码 — 绝无 AI 虚构",
    allBooks: "全部书籍",
    searchPlaceholder: "搜索案例... 如「融资危机」「PayPal」「垄断」",
    casesFound: (n) => (n === 1 ? "找到 1 个案例" : `找到 ${n} 个案例`),
    expand: "展开 →",
    collapse: "收起 ↑",
    who: "谁",
    company: "公司",
    when: "何时",
    where: "何地",
    summary: "摘要",
    context: "背景",
    trigger: "触发",
    action: "行动",
    result: "结果",
    after: "后续",
    hardNumbers: "核心数据",
    quotes: "引用",
    tags: "标签",
    concepts: "概念",
    sourceExcerpt: "原文摘录",
    noMatch: "未找到匹配案例。试试放宽筛选或换个关键词。",
    footerTitle: "案例库",
    footerBy: "来自 BotLearn · {bookCount} 本书 · {caseCount} 条案例，来源可追溯",
    footerNote: "每条案例均可追溯到书籍+页码。零幻觉。",
    langSwitch: "EN",
  },
  en: {
    backLink: "← Back to Books to Skill",
    title: "Case Library",
    subtitle: "Source-verified business stories for creators",
    desc: "Every case traceable to a specific book and page — never fabricated by AI",
    allBooks: "All books",
    searchPlaceholder: "Search cases... e.g. 'fundraising crisis', 'PayPal', 'monopoly'",
    casesFound: (n) => (n === 1 ? "1 case found" : `${n} cases found`),
    expand: "Expand →",
    collapse: "Collapse ↑",
    who: "Who",
    company: "Company",
    when: "When",
    where: "Where",
    summary: "Summary",
    context: "Context",
    trigger: "Trigger",
    action: "Action",
    result: "Result",
    after: "After",
    hardNumbers: "Hard numbers",
    quotes: "Quotes",
    tags: "Tags",
    concepts: "Concepts",
    sourceExcerpt: "Source excerpt",
    noMatch: "No matching cases. Try broader filters or different keywords.",
    footerTitle: "Case Library",
    footerBy: "by BotLearn · Source-verified stories from {bookCount} books · {caseCount} cases",
    footerNote: "Every case traceable to book + page. Zero hallucination.",
    langSwitch: "中文",
  },
};

const ALL_THEMES = [...new Set(ALL_CASES.flatMap((c) => c.themes))].sort();
const ALL_DOMAINS = [...new Set(ALL_CASES.flatMap((c) => c.domains))].sort();

// 按语言取案例正文，有 _zh 则优先显示中文
function getCaseText(c, field, lang) {
  const zhField = field + "_zh";
  if (lang === "zh" && c[zhField]) return c[zhField];
  return c[field] || "";
}


export default function CaseLibraryPage() {
  const [lang, setLang] = useState("zh");
  const [search, setSearch] = useState("");
  const [activeThemes, setActiveThemes] = useState(new Set());
  const [activeDomains, setActiveDomains] = useState(new Set());
  const [expandedCase, setExpandedCase] = useState(null);
  const [activeBook, setActiveBook] = useState(null);

  const t = T[lang];
  const themeLabels = THEME_LABELS[lang];
  const domainLabels = DOMAIN_LABELS[lang];

  const toggleTag = (set, setter, val) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const filtered = useMemo(() => {
    return ALL_CASES.filter((c) => {
      if (activeBook && c.book !== activeBook) return false;
      if (activeThemes.size > 0 && !c.themes.some((t) => activeThemes.has(t))) return false;
      if (activeDomains.size > 0 && !c.domains.some((d) => activeDomains.has(d))) return false;
      if (search.length > 2) {
        const q = search.toLowerCase();
        const haystack = [
          c.title,
          c.title_zh,
          c.before,
          c.before_zh,
          c.trigger,
          c.trigger_zh,
          c.action,
          c.action_zh,
          c.result,
          c.result_zh,
          c.after,
          c.after_zh,
          c.summary || "",
          c.summary_zh || "",
          ...c.who,
          ...c.company,
          ...(c.concepts || []),
          ...(c.concepts_zh || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
  }, [search, activeThemes, activeDomains, activeBook]);

  const s = {
    page: {
      minHeight: "100vh",
      background: "#faf8f5",
      color: "#1c1917",
      fontFamily: "'DM Sans',-apple-system,'Noto Sans SC',sans-serif",
      fontSize: 15,
      lineHeight: 1.7,
    },
    wrap: { maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" },
    backLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      color: "#78716c",
      textDecoration: "none",
      marginBottom: 24,
    },
    langBtn: {
      position: "absolute",
      top: 24,
      right: 24,
      padding: "6px 12px",
      fontSize: 12,
      fontWeight: 600,
      color: "#78716c",
      background: "#fff",
      border: "1px solid #e7e5e4",
      borderRadius: 8,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.2s",
    },
    h1: {
      fontSize: "clamp(2rem,5vw,2.75rem)",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      marginBottom: 8,
      background: "linear-gradient(135deg,#b45309 0%,#2563eb 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    sub: { fontSize: 17, color: "#57534e", marginBottom: 4, fontWeight: 500 },
    desc: { fontSize: 13, color: "#a8a29e", marginBottom: 40 },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #e7e5e4",
      borderRadius: 10,
      fontSize: 15,
      background: "#fff",
      color: "#1c1917",
      outline: "none",
      fontFamily: "inherit",
      marginBottom: 16,
    },
    filterRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
    tag: (active, color) => ({
      padding: "4px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      border: `1px solid ${active ? color + "60" : "#e7e5e4"}`,
      background: active ? color + "14" : "transparent",
      color: active ? color : "#78716c",
      transition: "all .15s",
      userSelect: "none",
    }),
    bookPill: (active, color) => ({
      padding: "6px 14px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: `1px solid ${active ? color : "#e7e5e4"}`,
      background: active ? color + "14" : "#fff",
      color: active ? color : "#78716c",
      transition: "all .15s",
      userSelect: "none",
    }),
    card: {
      background: "#fff",
      border: "1px solid #e7e5e4",
      borderRadius: 14,
      padding: "20px 22px",
      marginBottom: 14,
      cursor: "pointer",
      transition: "all .2s",
    },
    cardTitle: { fontSize: 16, fontWeight: 600, color: "#1c1917", marginBottom: 6 },
    cardMeta: { fontSize: 12, color: "#a8a29e", marginBottom: 10 },
    metaRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
      padding: "12px 14px",
      background: "#faf8f5",
      borderRadius: 10,
      borderLeft: "3px solid #b4530940",
    },
    metaChip: (emphasis) => ({
      fontSize: 12,
      fontWeight: emphasis ? 600 : 500,
      color: emphasis ? "#1c1917" : "#57534e",
      padding: "4px 10px",
      borderRadius: 6,
      background: emphasis ? "#fff" : "transparent",
      border: emphasis ? "1px solid #e7e5e4" : "none",
      boxShadow: emphasis ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
    }),
    metaLabel: { fontSize: 10, fontWeight: 600, color: "#a8a29e", letterSpacing: "0.05em", marginBottom: 2 },
    section: { marginBottom: 12 },
    sLabel: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#a8a29e",
      marginBottom: 3,
    },
    sText: { fontSize: 13, color: "#57534e", lineHeight: 1.6 },
    sTextCompact: { fontSize: 13, color: "#57534e", lineHeight: 1.55 },
    quote: {
      fontSize: 13,
      fontStyle: "italic",
      color: "#57534e",
      padding: "10px 14px",
      borderLeft: "3px solid #b4530940",
      background: "#faf8f5",
      borderRadius: "0 8px 8px 0",
      marginBottom: 8,
    },
    numBadge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 500,
      background: "#f0f9ff",
      color: "#0c4a6e",
      marginRight: 6,
      marginBottom: 4,
    },
    pill: (color) => ({
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 10,
      fontSize: 11,
      fontWeight: 500,
      background: (color || "#6b7280") + "18",
      color: color || "#6b7280",
      marginRight: 4,
      marginBottom: 4,
    }),
    excerpt: {
      fontSize: 12,
      color: "#78716c",
      fontStyle: "italic",
      padding: "12px 14px",
      background: "#faf8f5",
      borderRadius: 8,
      lineHeight: 1.6,
      borderLeft: "3px solid #2563eb30",
    },
    count: { fontSize: 13, color: "#a8a29e", marginBottom: 16 },
  };

  return (
    <div style={s.page}>
      <div style={{ ...s.wrap, position: "relative" }}>
        <button
          style={s.langBtn}
          onClick={() => setLang((l) => (l === "zh" ? "en" : "zh"))}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f4";
            e.currentTarget.style.borderColor = "#d6d3d1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#e7e5e4";
          }}
        >
          {t.langSwitch}
        </button>

        <Link to="/" style={s.backLink}>
          {t.backLink}
        </Link>

        <header style={{ marginBottom: 36, textAlign: "center" }}>
          <h1 style={s.h1}>{t.title}</h1>
          <p style={s.sub}>{t.subtitle}</p>
          <p style={s.desc}>{t.desc}</p>
        </header>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <div
            style={s.bookPill(activeBook === null, "#1c1917")}
            onClick={() => setActiveBook(null)}
          >
            {t.allBooks}
          </div>
          {BOOKS.map((b) => (
            <div
              key={b.id}
              style={s.bookPill(activeBook === b.id, b.color)}
              onClick={() => setActiveBook(activeBook === b.id ? null : b.id)}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: b.color,
                  display: "inline-block",
                  marginRight: 6,
                  verticalAlign: "middle",
                }}
              />
              {b.title}
              <span style={{ fontSize: 11, color: "#a8a29e", marginLeft: 6 }}>{b.cases}</span>
            </div>
          ))}
        </div>

        <input
          style={s.input}
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={s.filterRow}>
          {ALL_THEMES.map((themeKey) => (
            <span
              key={themeKey}
              style={s.tag(activeThemes.has(themeKey), THEME_COLORS[themeKey] || "#6b7280")}
              onClick={() => toggleTag(activeThemes, setActiveThemes, themeKey)}
            >
              {themeLabels[themeKey] ?? themeKey}
            </span>
          ))}
        </div>
        <div style={{ ...s.filterRow, marginBottom: 20 }}>
          {ALL_DOMAINS.map((domainKey) => (
            <span
              key={domainKey}
              style={{ ...s.tag(activeDomains.has(domainKey), "#2563eb"), borderStyle: "dashed" }}
              onClick={() => toggleTag(activeDomains, setActiveDomains, domainKey)}
            >
              {domainLabels[domainKey] ?? domainKey}
            </span>
          ))}
        </div>

        <div style={s.count}>{t.casesFound(filtered.length)}</div>

        {filtered.map((c) => {
          const expanded = expandedCase === c.id;
          const bookInfo = BOOKS.find((b) => b.id === c.book);
          const preview =
            getCaseText(c, "summary", lang) ||
            getCaseText(c, "trigger", lang) ||
            getCaseText(c, "before", lang) ||
            getCaseText(c, "action", lang) ||
            "";

          return (
            <div
              key={c.id}
              style={{
                ...s.card,
                borderLeft: `4px solid ${bookInfo?.color || "#999"}`,
                ...(expanded ? { boxShadow: "0 4px 20px rgba(0,0,0,0.06)" } : {}),
              }}
              onClick={() => setExpandedCase(expanded ? null : c.id)}
            >
              <div style={s.cardTitle}>{getCaseText(c, "title", lang) || c.title}</div>
              <div style={s.cardMeta}>
                {bookInfo?.title}
                {c.pages ? (lang === "zh" ? ` · 第${c.pages}页` : ` · pp.${c.pages}`) : ""}
              </div>

              {!expanded && (
                <div>
                  {(c.who?.length > 0 || c.company?.length > 0 || c.when) && (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#57534e",
                        marginBottom: 6,
                      }}
                    >
                      {[...(c.who || []), ...(c.company || [])].filter(Boolean).join(" · ")}
                      {c.when ? ` · ${c.when}` : ""}
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: "#78716c" }}>
                    {preview.slice(0, 120)}...
                    <span
                      style={{ color: "#b45309", marginLeft: 8, fontSize: 12, fontWeight: 500 }}
                    >
                      {t.expand}
                    </span>
                  </div>
                </div>
              )}

              {expanded && (
                <div style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                  {/* 主角信息：谁 · 公司 · 何时 · 何地 */}
                  <div style={s.metaRow}>
                    {c.who?.length > 0 && (
                      <div>
                        <div style={s.metaLabel}>{t.who}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {c.who.map((w) => (
                            <span key={w} style={s.metaChip(true)}>
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {c.company?.length > 0 && (
                      <div>
                        <div style={s.metaLabel}>{t.company}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {c.company.map((co) => (
                            <span key={co} style={s.metaChip(true)}>
                              {co}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {c.when && (
                      <div>
                        <div style={s.metaLabel}>{t.when}</div>
                        <span style={s.metaChip(false)}>{c.when}</span>
                      </div>
                    )}
                    {c.where && (
                      <div>
                        <div style={s.metaLabel}>{t.where}</div>
                        <span style={s.metaChip(false)}>{c.where}</span>
                      </div>
                    )}
                  </div>

                  {(c.summary || c.summary_zh) ? (
                    <div style={s.section}>
                      <div style={s.sLabel}>{t.summary}</div>
                      <div style={s.sText}>{getCaseText(c, "summary", lang)}</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {(c.before || c.before_zh) && (
                        <div style={s.section}>
                          <div style={s.sLabel}>{t.context}</div>
                          <div style={s.sTextCompact}>{getCaseText(c, "before", lang)}</div>
                        </div>
                      )}
                      {(c.trigger || c.trigger_zh) && (
                        <div style={s.section}>
                          <div style={s.sLabel}>{t.trigger}</div>
                          <div style={{ ...s.sTextCompact, fontWeight: 500, color: "#1c1917" }}>
                            {getCaseText(c, "trigger", lang)}
                          </div>
                        </div>
                      )}
                      {(c.action || c.action_zh) && (
                        <div style={s.section}>
                          <div style={s.sLabel}>{t.action}</div>
                          <div style={s.sTextCompact}>{getCaseText(c, "action", lang)}</div>
                        </div>
                      )}
                      {(c.result || c.result_zh) && (
                        <div style={s.section}>
                          <div style={s.sLabel}>{t.result}</div>
                          <div style={s.sTextCompact}>{getCaseText(c, "result", lang)}</div>
                        </div>
                      )}
                      {(c.after || c.after_zh) && (
                        <div style={s.section}>
                          <div style={s.sLabel}>{t.after}</div>
                          <div style={{ ...s.sTextCompact, color: "#059669" }}>
                            {getCaseText(c, "after", lang)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(c.numbers.length > 0 || (c.numbers_zh && c.numbers_zh.length > 0)) && (
                    <div style={s.section}>
                      <div style={s.sLabel}>{t.hardNumbers}</div>
                      <div>
                        {(lang === "zh" && c.numbers_zh?.length > 0 ? c.numbers_zh : c.numbers).map(
                          (n, i) => (
                            <span key={i} style={s.numBadge}>
                              {n}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {c.quotes.length > 0 && (
                    <div style={s.section}>
                      <div style={s.sLabel}>{t.quotes}</div>
                      {c.quotes.map((q, i) => (
                        <div key={i} style={s.quote}>
                          {`"${lang === "zh" && q.text_zh ? q.text_zh : q.text}"`}
                          <div
                            style={{
                              fontStyle: "normal",
                              fontSize: 11,
                              color: "#a8a29e",
                              marginTop: 4,
                            }}
                          >
                            — {q.speaker}
                            {q.page ? (lang === "zh" ? `，第${q.page}页` : `, p.${q.page}`) : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={s.section}>
                    <div style={s.sLabel}>{t.tags}</div>
                    <div>
                      {c.themes.map((themeKey) => (
                        <span key={themeKey} style={s.pill(THEME_COLORS[themeKey])}>
                          {themeLabels[themeKey] ?? themeKey}
                        </span>
                      ))}
                      {c.domains
                        .filter((d) => d !== "other")
                        .map((domainKey) => (
                          <span key={domainKey} style={s.pill("#2563eb")}>
                            {domainLabels[domainKey] ?? domainKey}
                          </span>
                        ))}
                      {c.function.map((f) => (
                        <span key={f} style={s.pill("#6b7280")}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(c.concepts?.length > 0 || c.concepts_zh?.length > 0) && (
                    <div style={s.section}>
                      <div style={s.sLabel}>{t.concepts}</div>
                      <div style={{ fontSize: 13, color: "#57534e" }}>
                        {(lang === "zh" && c.concepts_zh?.length > 0
                          ? c.concepts_zh
                          : c.concepts || []
                        ).join(" · ")}
                      </div>
                    </div>
                  )}

                  {(c.excerpt || c.excerpt_zh) && (
                    <div style={s.section}>
                      <div style={s.sLabel}>
                        {t.sourceExcerpt}
                        {c.pages ? (lang === "zh" ? `（第${c.pages}页）` : ` (pp. ${c.pages})`) : ""}
                      </div>
                      <div style={s.excerpt}>{getCaseText(c, "excerpt", lang)}</div>
                    </div>
                  )}

                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <span
                      style={{ fontSize: 12, color: "#a8a29e", cursor: "pointer" }}
                      onClick={() => setExpandedCase(null)}
                    >
                      {t.collapse}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 16px",
              color: "#a8a29e",
              fontSize: 15,
            }}
          >
            {t.noMatch}
          </div>
        )}

        <footer
          style={{
            textAlign: "center",
            paddingTop: 48,
            borderTop: "1px solid #e7e5e4",
            marginTop: 40,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1917", marginBottom: 4 }}>
            {t.footerTitle}
          </div>
          <div style={{ fontSize: 12, color: "#a8a29e" }}>
            {t.footerBy
              .replace("{bookCount}", BOOKS.length)
              .replace("{caseCount}", ALL_CASES.length)}
          </div>
          <div style={{ fontSize: 11, color: "#d6d3d1", marginTop: 8 }}>{t.footerNote}</div>
        </footer>
      </div>
    </div>
  );
}
