"use client";

import { useEffect, useMemo, useState } from "react";
import Landing from "./Landing";
import {
  PHASE_LABEL,
  type JapanPlan,
  type JapanProfile,
  type PlanPhase,
  type PlanTask,
  type TaskGuide,
} from "@/lib/types";

const VISA_OPTS: { value: JapanProfile["visaType"]; label: string }[] = [
  { value: "student", label: "유학 비자 (Student)" },
  { value: "working_holiday", label: "워킹홀리데이 (Working Holiday)" },
  { value: "work", label: "취업 비자 (Work)" },
  { value: "other", label: "기타 (Other)" },
];

const PHASES: PlanPhase[] = ["before", "arrival", "settling"];
type Tab = "home" | "tasks" | "scanner" | "mentors" | "profile";

function dday(arrival: string): number | null {
  const t = new Date(arrival + "T00:00:00");
  if (isNaN(t.getTime())) return null;
  return Math.round((t.getTime() - new Date(new Date().toDateString()).getTime()) / 86_400_000);
}

export default function Home() {
  const [profile, setProfile] = useState<JapanProfile>({ schoolMajor: "", visaType: "student", arrivalDate: "" });
  const [step, setStep] = useState<"onboarding" | "plan">("onboarding");
  const [tab, setTab] = useState<Tab>("tasks");
  const [plan, setPlan] = useState<JapanPlan | null>(null);
  const [phase, setPhase] = useState<PlanPhase>("before");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI 가이드 상태
  const [guides, setGuides] = useState<Record<string, TaskGuide>>({});
  const [guideOpen, setGuideOpen] = useState<Set<string>>(new Set());
  const [guideLoading, setGuideLoading] = useState<Set<string>>(new Set());
  const [guideErr, setGuideErr] = useState<Record<string, string>>({});

  // 랜딩(상세페이지) 표시 상태. 기본: 데스크톱은 랜딩, 모바일은 앱.
  // DARI JAPAN 로고를 누르면 어느 기기에서든 상세페이지로 돌아감.
  const [showLanding, setShowLanding] = useState(false);
  useEffect(() => {
    setShowLanding(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  const set = (k: keyof JapanProfile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  async function generate() {
    if (!profile.schoolMajor.trim() || !profile.arrivalDate || loading) {
      setError("학교/전공과 입국 예정일을 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "플랜 생성 실패");
      setPlan(data as JapanPlan);
      setDone(new Set());
      setGuides({});
      setGuideOpen(new Set());
      setPhase("before");
      setTab("tasks");
      setStep("plan");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function loadGuide(task: PlanTask) {
    const isOpen = guideOpen.has(task.id);
    setGuideOpen((prev) => {
      const n = new Set(prev);
      if (isOpen) n.delete(task.id);
      else n.add(task.id);
      return n;
    });
    if (isOpen) return;
    if (guides[task.id] || guideLoading.has(task.id)) return;
    setGuideLoading((p) => {
      const n = new Set(p);
      n.add(task.id);
      return n;
    });
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, task }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "가이드 생성 실패");
      setGuides((g) => ({ ...g, [task.id]: data as TaskGuide }));
    } catch (e) {
      setGuideErr((er) => ({ ...er, [task.id]: e instanceof Error ? e.message : "오류" }));
    } finally {
      setGuideLoading((p) => {
        const n = new Set(p);
        n.delete(task.id);
        return n;
      });
    }
  }

  const d = dday(profile.arrivalDate);
  const total = plan?.tasks.length ?? 0;
  const pct = total ? Math.round((done.size / total) * 100) : 0;
  const phaseTasks = useMemo(() => plan?.tasks.filter((t) => t.phase === phase) ?? [], [plan, phase]);
  const countOf = (p: PlanPhase) => plan?.tasks.filter((t) => t.phase === p).length ?? 0;
  const visaLabel = VISA_OPTS.find((o) => o.value === profile.visaType)?.label ?? profile.visaType;

  const heroEl = (
    <section className="hero">
      <p className="hero-kicker">Your Journey</p>
      <h1 className="hero-dday">{d === null ? "입국 예정" : d >= 0 ? `D-${d} 입국 예정` : `D+${Math.abs(d)} (입국함)`}</h1>
      <p className="hero-sub">{plan?.summary || "일본 생활 준비를 시작합니다."}</p>
      <div className="progress-row">
        <span className="lbl">정착 준비율</span>
        <span className="pct">{pct}%</span>
      </div>
      <div className="progress"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
    </section>
  );

  if (showLanding) {
    return <Landing onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className="phone">
      <header className="topbar">
        <button className="icon-btn" aria-label="menu">☰</button>
        <button className="brand-btn" onClick={() => setShowLanding(true)} title="상세페이지로"><img className="applogo" src="/dari-logo.png" alt="DARI JAPAN" /></button>
        <button className="icon-btn" aria-label="alerts">🔔</button>
      </header>

      {/* ===== Onboarding (first-time profile setup) ===== */}
      {step === "onboarding" ? (
        <div className="screen">
          <div className="stepbar-head">
            <button className="back" aria-label="back" onClick={() => plan && setStep("plan")}>←</button>
            <span className="step-label">내 정보 입력</span>
            <span style={{ width: 20 }} />
          </div>
          <div className="stepbar"><div className="stepbar-fill" style={{ width: "100%" }} /></div>

          <div className="onb-illust">
            <img src="/dari-logo.png" alt="DARI" />
          </div>

          <h1 className="onb-title">환영합니다! 여정을 준비해볼까요?</h1>
          <p className="onb-sub">맞춤 플랜을 위해 기본 정보를 입력해주세요. (이 정보는 Profile에서 언제든 수정)</p>

          <div className="field">
            <label>학교 및 전공 (School &amp; Major)</label>
            <div className="input-wrap">
              <span className="emoji">🏫</span>
              <input type="text" placeholder="예: 도쿄대학교 경제학부" value={profile.schoolMajor} onChange={(e) => set("schoolMajor", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>비자 종류 (Visa Type)</label>
            <div className="input-wrap">
              <span className="emoji">🪪</span>
              <select value={profile.visaType} onChange={(e) => set("visaType", e.target.value)}>
                {VISA_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>입국 예정일 (Arrival Date)</label>
            <div className="input-wrap">
              <span className="emoji">✈️</span>
              <input type="date" value={profile.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} />
            </div>
          </div>

          {error && <p className="error">⚠️ {error}</p>}

          <div style={{ marginTop: 24 }}>
            <button className="btn-primary" onClick={generate} disabled={loading}>
              {loading ? "AI가 플랜을 짜는 중…" : <>맞춤 플랜 생성 <span>→</span></>}
            </button>
          </div>
          <p className="disclaimer">정보 안내·절차 가이드이며 법적 자문이 아닙니다. 비자·체류 사안은 출입국·학교 국제처에 확인하세요.</p>
        </div>
      ) : (
        <>
          {/* ===== Tasks ===== */}
          {tab === "tasks" && (
            <div className="screen">
              {heroEl}
              <h2 className="section-title"><span className="badge">🤖</span>AI 맞춤 체크리스트</h2>
              <div className="pills">
                {PHASES.map((p) => (
                  <button key={p} className={`pill ${phase === p ? "active" : ""}`} onClick={() => setPhase(p)}>
                    {PHASE_LABEL[p]}<span className="count">{countOf(p)}</span>
                  </button>
                ))}
              </div>
              <div className="tasks">
                {phaseTasks.length === 0 && <div className="empty">이 단계의 항목이 없습니다.</div>}
                {phaseTasks.map((t) => {
                  const isDone = done.has(t.id);
                  const open = guideOpen.has(t.id);
                  const g = guides[t.id];
                  return (
                    <div key={t.id} className={`task ${isDone ? "done" : t.priority === "high" ? "active" : ""}`}>
                      <button className="task-check" onClick={() => toggle(t.id)} aria-label="toggle">{isDone ? "✓" : ""}</button>
                      <div className="task-body">
                        <h3 className="task-title">{t.titleKo}</h3>
                        {t.titleEn && <p className="task-en">{t.titleEn}</p>}
                        {t.description && <p className="task-desc">{t.description}</p>}
                        <div className="chips">
                          {t.category && <span className="chip">{t.category}</span>}
                          {t.dueLabel && <span className={`chip due ${t.priority === "high" ? "high" : ""}`}>⏰ {t.dueLabel}</span>}
                        </div>
                        <button className="ai-guide-btn" onClick={() => loadGuide(t)}>
                          🤖 {open ? "가이드 접기" : "AI 가이드 보기"}
                        </button>
                        {open && (
                          <div className="guide">
                            {guideLoading.has(t.id) ? (
                              <div className="guide-loading"><span className="spinner-sm" />AI가 맞춤 가이드를 작성 중…</div>
                            ) : guideErr[t.id] ? (
                              <p className="error">⚠️ {guideErr[t.id]}</p>
                            ) : g ? (
                              <>
                                {g.overview && <p className="g-overview">{g.overview}</p>}
                                {g.steps.length > 0 && (
                                  <div className="g-block"><div className="g-h">✅ 단계</div><ol>{g.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
                                )}
                                {g.documents.length > 0 && (
                                  <div className="g-block"><div className="g-h">📄 준비물</div><ul>{g.documents.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                )}
                                {g.phrases.length > 0 && (
                                  <div className="g-block">
                                    <div className="g-h">🗣️ 현장 일본어</div>
                                    {g.phrases.map((p, i) => (
                                      <div className="g-phrase" key={i}><span className="ja">{p.ja}</span><span className="ko">{p.ko}</span></div>
                                    ))}
                                  </div>
                                )}
                                {g.tips.length > 0 && (
                                  <div className="g-block"><div className="g-h">💡 한국인 꿀팁</div><ul>{g.tips.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                )}
                              </>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== Home ===== */}
          {tab === "home" && (
            <div className="screen">
              {heroEl}
              <p className="home-msg">아래 버튼으로 오늘의 할 일을 확인하세요. 정보를 바꾸면 Profile에서 플랜을 다시 만들 수 있어요.</p>
              <button className="btn-primary" onClick={() => setTab("tasks")}>오늘의 체크리스트 보기 →</button>
            </div>
          )}

          {/* ===== Profile (drives personalization) ===== */}
          {tab === "profile" && (
            <div className="screen">
              <h2 className="section-title"><span className="badge">👤</span>내 프로필</h2>
              <p className="profile-note">이 정보를 바탕으로 맞춤 플랜이 생성됩니다.</p>
              <div className="profile-card">
                <div className="prow"><span className="pk">학교 · 전공</span><span className="pv">{profile.schoolMajor || "-"}</span></div>
                <div className="prow"><span className="pk">체류 유형</span><span className="pv">{visaLabel}</span></div>
                <div className="prow"><span className="pk">입국 예정일</span><span className="pv">{profile.arrivalDate || "-"}{d !== null && d >= 0 ? ` (D-${d})` : ""}</span></div>
                <div className="prow"><span className="pk">체크리스트</span><span className="pv">{total}개 · 준비율 {pct}%</span></div>
              </div>
              <button className="btn-primary" onClick={() => setStep("onboarding")}>정보 수정 · 플랜 다시 생성</button>
            </div>
          )}

          {/* ===== Scanner / Mentors (mockup) ===== */}
          {tab === "scanner" && (
            <div className="screen">
              <div className="placeholder">
                <div className="ph-emoji">📄</div>
                <h3>AI 공지 해석기</h3>
                <p>일본어 공지를 찍으면 번역 + 할 일로 변환.<br />데모 목업 · 준비 중입니다.</p>
              </div>
            </div>
          )}
          {tab === "mentors" && (
            <div className="screen">
              <div className="placeholder">
                <div className="ph-emoji">🎓</div>
                <h3>선배 멘토 매칭</h3>
                <p>같은 학교·진로의 선배와 연결.<br />데모 목업 · 준비 중입니다.</p>
              </div>
            </div>
          )}

          {/* ===== Bottom nav (clickable) ===== */}
          <nav className="bottomnav">
            <button className={`navitem ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}><span className="ico">🏠</span>Home</button>
            <button className={`navitem ${tab === "tasks" ? "active" : ""}`} onClick={() => setTab("tasks")}><span className="ico">✅</span>Tasks</button>
            <button className={`navitem ${tab === "scanner" ? "active" : ""}`} onClick={() => setTab("scanner")}><span className="ico">📄</span>Scanner</button>
            <button className={`navitem ${tab === "mentors" ? "active" : ""}`} onClick={() => setTab("mentors")}><span className="ico">🎓</span>Mentors</button>
            <button className={`navitem ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}><span className="ico">👤</span>Profile</button>
          </nav>
        </>
      )}
    </div>
  );
}
