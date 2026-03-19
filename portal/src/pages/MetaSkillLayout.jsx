import { Link } from "react-router-dom";

const SectionHeader = ({ children }) => (
  <h2 style={{ fontSize: 11, fontWeight: 700, color: "#78716c", marginBottom: 18, letterSpacing: "0.1em", textTransform: "uppercase" }}>
    {children}
  </h2>
);

export default function MetaSkillLayout({ meta, content }) {
  const accent = "#b45309";

  if (!content) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", padding: 48, fontFamily: "'DM Sans', sans-serif" }}>
        <Link to="/" style={{ color: accent, textDecoration: "none" }}>← 返回首页</Link>
        <h1>{meta?.label}</h1>
        <p>{meta?.desc}</p>
        <a href={meta?.link}>查看 GitHub 源码 →</a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fdfcfa 0%, #faf8f5 100%)",
      color: "#1c1917",
      fontFamily: "'DM Sans', -apple-system, 'Noto Sans SC', sans-serif",
      fontSize: 15,
      lineHeight: 1.75,
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 96px" }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: "#78716c",
            textDecoration: "none",
            marginBottom: 40,
            fontWeight: 500,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = accent; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#78716c"; }}
        >
          ← 返回首页
        </Link>

        {/* Header */}
        <header style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "#1c1917", marginBottom: 14, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            {meta.label}
          </h1>
          <p style={{ fontSize: 18, color: "#57534e", lineHeight: 1.6, maxWidth: 520 }}>
            {meta.one}
          </p>
        </header>

        {/* Input → Output */}
        <div style={{
          padding: "24px 26px",
          background: "#fff",
          border: "1px solid #e7e5e4",
          borderLeft: `4px solid ${accent}`,
          borderRadius: 14,
          marginBottom: 48,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#78716c", marginBottom: 10, letterSpacing: "0.1em" }}>输入 → 输出</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#1c1917", lineHeight: 1.5 }}>
            {meta.input} → {meta.output}
          </div>
        </div>

        {/* 简介 */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader>简介</SectionHeader>
          <p style={{ fontSize: 16, color: "#44403c", lineHeight: 1.85 }}>
            {meta.desc}
          </p>
        </section>

        {/* 设计理念 */}
        {content.designPhilosophy && (
          <section style={{ marginBottom: 48 }}>
            <SectionHeader>设计理念</SectionHeader>
            <p style={{ fontSize: 16, color: "#57534e", marginBottom: 20, lineHeight: 1.75 }}>
              {content.designPhilosophy.tagline}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {content.designPhilosophy.principles.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px 18px",
                    background: "#fff",
                    border: "1px solid #e7e5e4",
                    borderRadius: 12,
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                    e.currentTarget.style.borderColor = "#d6d3d1";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e7e5e4";
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 6 }}>{p.tag}</div>
                  <div style={{ fontSize: 14, color: "#57534e", lineHeight: 1.55 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 核心资产 (books-to-skill) */}
        {content.coreAssets && (
          <section style={{ marginBottom: 48 }}>
            <SectionHeader>{content.coreAssets.title}</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {content.coreAssets.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "24px 24px 22px",
                    background: "#fff",
                    border: "1px solid #e7e5e4",
                    borderLeft: "4px solid " + (i === 0 ? "#f0c040" : "#4a90d9"),
                    borderRadius: 14,
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1c1917", marginBottom: 8 }}>{item.name}</div>
                  <div style={{ fontSize: 14, color: "#78716c", fontWeight: 600, marginBottom: 10 }}>{item.stats}</div>
                  <p style={{ fontSize: 15, color: "#57534e", lineHeight: 1.7, margin: 0 }}>{item.detail || item.desc}</p>
                  {item.domains && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18, paddingTop: 18, borderTop: "1px solid #e7e5e4" }}>
                      {item.domains.map((d, j) => (
                        <span
                          key={j}
                          style={{
                            padding: "6px 14px",
                            background: d.color + "18",
                            border: `1px solid ${d.color}50`,
                            borderRadius: 8,
                            fontSize: 13,
                            color: d.color,
                            fontWeight: 600,
                          }}
                        >
                          {d.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 生成的网页包含 (skill-to-showcase) */}
        {content.pageTabs && (
          <section style={{ marginBottom: 48 }}>
            <SectionHeader>{content.pageTabs.title}</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {content.pageTabs.tabs.map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: "20px 22px",
                    background: "#fff",
                    border: "1px solid #e7e5e4",
                    borderLeft: `4px solid ${t.color}`,
                    borderRadius: 14,
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: t.color + "22",
                      color: t.color,
                      fontSize: 14,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {i + 1}
                    </span>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#1c1917" }}>{t.name}</span>
                      <span style={{ fontSize: 13, color: "#78716c", marginLeft: 10, fontWeight: 500 }}>{t.label}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.items.map((it, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#57534e", lineHeight: 1.5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.color, flexShrink: 0, marginTop: 9 }} />
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 生产流程 / 生成流程 */}
        {content.workflow && (
          <section style={{ marginBottom: 48 }}>
            <SectionHeader>{content.workflow.title}</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {content.workflow.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 24, marginBottom: i < content.workflow.steps.length - 1 ? 24 : 0 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: accent,
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 8px ${accent}40`,
                    }}>
                      {step.n}
                    </div>
                    {i < content.workflow.steps.length - 1 && (
                      <div style={{ width: 2, height: 40, background: "linear-gradient(180deg, #e7e5e4 0%, #d6d3d1 100%)", margin: "10px auto 0" }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1c1917", marginBottom: 8 }}>{step.title}</div>
                    <p style={{ fontSize: 15, color: "#57534e", lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 输出结构 */}
        {content.outputStructure && (
          <section style={{ marginBottom: 48 }}>
            <SectionHeader>{content.outputStructure.title}</SectionHeader>
            <pre style={{
              margin: 0,
              padding: "24px 26px",
              background: "#fff",
              border: "1px solid #e7e5e4",
              borderRadius: 14,
              fontSize: 13,
              lineHeight: 1.9,
              color: "#57534e",
              fontFamily: "ui-monospace, 'SF Mono', 'Menlo', monospace",
              overflow: "auto",
            }}>
              {content.outputStructure.tree}
            </pre>
          </section>
        )}

        {/* GitHub 链接 */}
        <div style={{ paddingTop: 24, borderTop: "1px solid #e7e5e4" }}>
          <a
            href={meta.link}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 24px",
              fontSize: 15,
              fontWeight: 700,
              color: accent,
              textDecoration: "none",
              background: accent + "14",
              borderRadius: 12,
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = accent + "22";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = accent + "14";
              e.currentTarget.style.transform = "none";
            }}
          >
            查看 GitHub 源码 →
          </a>
        </div>
      </div>
    </div>
  );
}
