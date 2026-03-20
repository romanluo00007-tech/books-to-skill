import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KNOWLEDGE_SKILLS, META_SKILLS, CREATOR_SKILLS, COMING_SOON_DOMAINS, PROJECT_STRUCTURE, GITHUB_URL } from "./config";
import BooksToSkillPage from "./pages/BooksToSkillPage";
import SkillToShowcasePage from "./pages/SkillToShowcasePage";
import CaseLibraryPage from "./pages/CaseLibraryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/case-library" element={<CaseLibraryPage />} />
        <Route path="/meta/books-to-skill" element={<BooksToSkillPage />} />
        <Route path="/meta/skill-to-showcase" element={<SkillToShowcasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomeContent() {
  const [copiedCmd, setCopiedCmd] = useState(null);

  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedCmd(cmd);
      setTimeout(() => setCopiedCmd(null), 1500);
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#faf8f5",
      color: "#1c1917",
      fontFamily: "'DM Sans', -apple-system, 'Noto Sans SC', sans-serif",
      fontSize: 15,
      lineHeight: 1.7,
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Hero — 书本气质 */}
        <header style={{ textAlign: "center", marginBottom: 72 }}>
          <h1 style={{
            fontSize: "clamp(2.75rem, 7vw, 3.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 14,
            background: "linear-gradient(135deg, #b45309 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Books to Skill
          </h1>
          <p style={{
            fontSize: 19,
            fontWeight: 500,
            color: "#44403c",
            lineHeight: 1.6,
            maxWidth: 420,
            margin: "0 auto 10px",
          }}>
            将书籍转化为可复用的 AI 技能
          </p>
          <p style={{
            fontSize: 13,
            color: "#a8a29e",
            letterSpacing: "0.02em",
          }}>
            覆盖营销、战略、销售、产品等方法论
          </p>
          <p style={{
            fontSize: 13,
            color: "#a8a29e",
            letterSpacing: "0.02em",
            marginTop: 4,
          }}>
            提供商业故事、人物传记等真实案例
          </p>
        </header>

        {/* 快速入口 — 行动导向，每选项直达 */}
        <section style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#b45309", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>快速入口</p>
          <p style={{ fontSize: 15, color: "#57534e", marginBottom: 20 }}>选一个，直接去</p>

          {/* 路径 1：我是咨询顾问 */}
          <div style={{
            padding: "20px 20px 18px",
            marginBottom: 16,
            background: "#fff",
            border: "1px solid #e7e5e4",
            borderLeft: "4px solid #b45309",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1c1917", marginBottom: 4 }}>我是咨询顾问</div>
            <div style={{ fontSize: 12, color: "#78716c", marginBottom: 14 }}>了解安装方式、框架内容、自测巩固</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {KNOWLEDGE_SKILLS.filter(sk => !sk.comingSoon).map((sk) => (
                <a
                  key={sk.id}
                  href={sk.showcasePath}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 18px",
                    background: "#fff",
                    border: `1px solid ${sk.color}40`,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    color: sk.color,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${sk.color}12`;
                    e.currentTarget.style.boxShadow = `0 4px 14px ${sk.color}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: sk.color }} />
                  {sk.name.replace("方法论", "")} →
                </a>
              ))}
            </div>
          </div>

          {/* 路径 2：我是创作者 */}
          <div style={{
            padding: "20px 20px 18px",
            marginBottom: 16,
            background: "#fff",
            border: "1px solid #e7e5e4",
            borderLeft: "4px solid #2563eb",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1c1917", marginBottom: 4 }}>我是创作者</div>
            <div style={{ fontSize: 12, color: "#78716c", marginBottom: 14 }}>来源可追溯的商业案例，供写作、内容、示例使用</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {CREATOR_SKILLS.map((sk) => (
                <a
                  key={sk.id}
                  href={sk.pagePath}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 18px",
                    background: "#fff",
                    border: `1px solid ${sk.color}40`,
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    color: sk.color,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${sk.color}12`;
                    e.currentTarget.style.boxShadow = `0 4px 14px ${sk.color}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: sk.color }} />
                  {sk.name} →
                </a>
              ))}
            </div>
          </div>

          {/* 路径 3：我是 Skill 开发者 */}
          <div style={{
            padding: "20px 20px 18px",
            background: "#fff",
            border: "1px solid #e7e5e4",
            borderLeft: "4px solid #8b5cf6",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1c1917", marginBottom: 4 }}>我是 Skill 开发者</div>
            <div style={{ fontSize: 12, color: "#78716c", marginBottom: 14 }}>书籍转 Skill、Skill 转展示网页</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {META_SKILLS.map((m) => (
                <a
                  key={m.id}
                  href={m.pagePath}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 18px",
                    background: "#fff",
                    border: "1px solid #9b59b640",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#8b5cf6",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#8b5cf612";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(139,92,246,0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6" }} />
                  {m.label} →
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 生产工具 — 移到领域方法论上面 */}
        <section style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#b45309", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>生产工具</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", marginBottom: 24 }}>元工具 Meta Skill</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {META_SKILLS.map((m) => (
              <a
                key={m.id}
                href={m.pagePath}
                style={{
                  display: "block",
                  padding: "24px",
                  paddingLeft: 20,
                  background: "#fff",
                  border: "1px solid #e7e5e4",
                  borderLeft: "4px solid #b45309",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#d6d3d1";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e7e5e4";
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1c1917", marginBottom: 8 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: "#57534e", lineHeight: 1.6, marginBottom: 12 }}>{m.one}</div>
                <div style={{ fontSize: 12, color: "#a8a29e", lineHeight: 1.5 }}>
                  {m.input} → {m.output}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 领域方法论 */}
        <section style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#b45309", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>领域方法论</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", marginBottom: 24 }}>知识 Skill</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {KNOWLEDGE_SKILLS.map((sk) => (
              <div
                key={sk.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                  padding: "18px 24px 18px 20px",
                  background: "#fff",
                  border: "1px solid #e7e5e4",
                  borderLeft: `4px solid ${sk.color}`,
                  borderRadius: 12,
                  opacity: sk.comingSoon ? 0.7 : 1,
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => {
                  if (!sk.comingSoon) {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                    e.currentTarget.style.borderColor = `${sk.color}40`;
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e7e5e4";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#1c1917", marginBottom: 4 }}>{sk.name}</div>
                    <div style={{ fontSize: 13, color: "#57534e" }}>{sk.one}</div>
                    {!sk.comingSoon && (
                      <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 6 }}>{sk.frameworkCount} 个框架 · {sk.bookCount} 本书</div>
                    )}
                  </div>
                </div>
                {sk.comingSoon ? (
                  <span style={{ fontSize: 13, color: "#a8a29e", padding: "8px 14px", background: "#f5f5f4", borderRadius: 8 }}>敬请期待</span>
                ) : (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0, justifyContent: "flex-end" }}>
                    <a
                      href={sk.showcasePath}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: sk.color,
                        textDecoration: "none",
                        padding: "8px 16px",
                        background: `${sk.color}12`,
                        borderRadius: 8,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${sk.color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${sk.color}12`; }}
                    >
                      进入展示站 →
                    </a>
                    <button
                      onClick={() => copyCmd(sk.installCmd)}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "8px 14px",
                        background: "#f5f5f4",
                        color: "#57534e",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#e7e5e4"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#f5f5f4"; }}
                    >
                      {copiedCmd === sk.installCmd ? "已复制" : "复制命令"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* 开发中领域 — 迷你卡片 */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#a8a29e", letterSpacing: "0.08em", marginBottom: 14 }}>开发中 · 敬请期待</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
              {COMING_SOON_DOMAINS.map((d) => (
                <div
                  key={d.name}
                  style={{
                    padding: "14px 16px",
                    background: "#fff",
                    border: `1px solid ${d.color}30`,
                    borderLeft: `3px solid ${d.color}`,
                    borderRadius: 10,
                    opacity: 0.9,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 4px 16px ${d.color}15`;
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.opacity = "0.9";
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: d.color, marginBottom: 2 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: "#a8a29e" }}>即将上线</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 案例数据库 */}
        <section style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>案例数据库</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", marginBottom: 24 }}>来源可追溯的商业故事</h2>
          <a
            href="/case-library"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              padding: "24px 24px 24px 20px",
              background: "#fff",
              border: "1px solid #e7e5e4",
              borderLeft: "4px solid #2563eb",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.12)";
              e.currentTarget.style.borderColor = "#2563eb40";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e7e5e4";
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#1c1917", marginBottom: 6 }}>案例库</div>
              <div style={{ fontSize: 14, color: "#57534e", lineHeight: 1.6 }}>
                商业故事、人物传记等真实案例，每条可追溯到书籍与页码
              </div>
              <div style={{ fontSize: 12, color: "#a8a29e", marginTop: 8 }}>Zero to One · Elon Musk · 22 条案例</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#2563eb" }}>进入案例库 →</span>
            </div>
          </a>
        </section>

        {/* 项目结构 */}
        <section style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#b45309", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>架构</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1c1917", marginBottom: 24 }}>项目结构</h2>
          <div style={{
            padding: "24px 28px",
            background: "#fff",
            border: "1px solid #e7e5e4",
            borderRadius: 12,
            marginBottom: 20,
          }}>
            <pre style={{
              margin: 0,
              fontSize: 13,
              color: "#57534e",
              lineHeight: 1.9,
              fontFamily: "ui-monospace, 'SF Mono', 'Menlo', monospace",
              overflow: "auto",
            }}>
              {PROJECT_STRUCTURE}
            </pre>
            <a
              href={GITHUB_URL}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 20,
                padding: "10px 18px",
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
              GitHub →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          textAlign: "center",
          paddingTop: 48,
          borderTop: "1px solid #e7e5e4",
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1c1917", marginBottom: 6 }}>Books to Skill</div>
          <div style={{ fontSize: 13, color: "#78716c" }}>将书籍转化为可复用技能</div>
        </footer>
      </div>
    </div>
  );
}
