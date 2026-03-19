import { Link } from "react-router-dom";

export default function MetaSkillLayout({ meta }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf8f5",
      color: "#1c1917",
      fontFamily: "'DM Sans', -apple-system, 'Noto Sans SC', sans-serif",
      fontSize: 15,
      lineHeight: 1.7,
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: "#78716c",
            textDecoration: "none",
            marginBottom: 32,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#b45309"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#78716c"; }}
        >
          ← 返回首页
        </Link>

        <header style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 32,
            fontWeight: 400,
            color: "#1c1917",
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}>
            {meta.label}
          </h1>
          <p style={{ fontSize: 17, color: "#57534e", lineHeight: 1.6 }}>
            {meta.one}
          </p>
        </header>

        <div style={{
          padding: "24px 24px 20px",
          background: "#fff",
          border: "1px solid #e7e5e4",
          borderLeft: "4px solid #b45309",
          borderRadius: 12,
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#78716c", marginBottom: 12 }}>输入 → 输出</div>
          <div style={{ fontSize: 16, color: "#1c1917", fontFamily: "'SF Mono', monospace" }}>
            {meta.input} → {meta.output}
          </div>
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "#78716c", marginBottom: 12, letterSpacing: "0.05em" }}>简介</h2>
          <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8 }}>
            {meta.desc}
          </p>
        </section>

        <a
          href={meta.link}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 600,
            color: "#b45309",
            textDecoration: "none",
            background: "#b4530912",
            borderRadius: 10,
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#b4530918"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#b4530912"; }}
        >
          查看 GitHub 源码 →
        </a>
      </div>
    </div>
  );
}
