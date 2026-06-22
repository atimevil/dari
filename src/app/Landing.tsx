"use client";

const SOS = [
  { ic: "🏥", label: "의료 / 병원", danger: true },
  { ic: "🏛️", label: "행정 / 관공서" },
  { ic: "🏠", label: "주거 / 부동산" },
  { ic: "👥", label: "친구 / 교류" },
  { ic: "🎓", label: "학업 / 수강" },
  { ic: "💼", label: "알바 / 취업" },
  { ic: "🏦", label: "금융 / 은행" },
  { ic: "❓", label: "기타 문의" },
];

const REASONS = [
  { ic: "🎯", h: "개인 맞춤형", p: "내 상황에 꼭 맞는 정보만 선별 제공" },
  { ic: "⚡", h: "행동 중심", p: "단순 정보가 아닌 구체적인 실행 플랜" },
  { ic: "🤝", h: "선배 연결", p: "경험자의 생생한 노하우 전수" },
  { ic: "🧭", h: "전체 흐름 관리", p: "입국 전부터 졸업까지 원스톱 케어" },
  { ic: "💓", h: "적응 상태 점검", p: "주기적인 멘탈 케어 및 진도 체크" },
];

const MENTORS = [
  { sch: "와세다 대학교", maj: "정치경제학부 3학년" },
  { sch: "게이오 대학교", maj: "상학부 졸업생" },
  { sch: "도쿄 대학교", maj: "공학부 4학년" },
];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="landing">
      <header className="lhead">
        <span className="brand">DARI JAPAN</span>
        <button className="lbtn primary" onClick={onStart}>시작하기</button>
      </header>

      {/* Hero */}
      <section className="lhero">
        <span className="badge">🎓 유학생 맞춤형 솔루션</span>
        <h1>일본 유학의 첫걸음,<br /><span className="accent">AI와 선배가 함께합니다</span></h1>
        <p className="sub">복잡한 서류 준비부터 현지 정착, 학업 고민까지. 다리재팬이 당신의 든든한 다리가 되어드립니다.</p>
        <div className="cta-row">
          <button className="lbtn primary" onClick={onStart}>지금 시작하기 <span>→</span></button>
          <button className="lbtn ghost" onClick={onStart}>서비스 둘러보기</button>
        </div>
      </section>

      {/* 개인화된 온보딩 */}
      <section className="lsec white">
        <div className="inner">
          <div className="sec-head">
            <h2>개인화된 온보딩</h2>
            <p>학교, 전공, 입국일에 맞춘 완벽한 플랜을 경험하세요.</p>
          </div>
          <div className="lcards3">
            <div className="lcard"><div className="ic">🏫</div><h4>학교 및 전공 입력</h4><p>진학 예정인 대학교와 전공을 입력하여 맞춤 정보를 받습니다.</p></div>
            <div className="lcard"><div className="ic">📅</div><h4>입국일 설정</h4><p>출국 및 입국 일정에 맞춰 D-Day 플랜이 자동 생성됩니다.</p></div>
            <div className="lcard"><div className="ic">📋</div><h4>맞춤 플랜 생성</h4><p>비자, 주거, 수강신청 등 필수 단계별 플랜이 제공됩니다.</p></div>
          </div>
        </div>
      </section>

      {/* 시기별 적응 체크리스트 */}
      <section className="lsec">
        <div className="inner">
          <div className="sec-head">
            <h2>시기별 적응 체크리스트</h2>
            <p>입국 전부터 학기 중까지 놓치지 말아야 할 필수 항목들입니다.</p>
          </div>
          <div className="lcheck-row">
            <div className="lcheck-img" />
            <div className="lcheck-body">
              <h4>입국 전</h4>
              <ul>
                <li><span className="ck">✓</span> 비자 발급 및 서류 준비</li>
                <li><span className="ck">✓</span> 기숙사 신청 또는 방 구하기 (주거 준비)</li>
                <li><span className="ck">✓</span> 항공권 예매 및 짐 싸기</li>
              </ul>
            </div>
          </div>
          <div className="lcards3">
            <div className="lcard"><h4>도착 직후</h4><ul><li>• 재류카드 주소 등록</li><li>• 국민건강보험 가입</li><li>• 휴대폰 개통 및 은행 계좌 개설</li></ul></div>
            <div className="lcard"><h4>첫 한 달</h4><ul><li>• 수강신청 및 오리엔테이션 참석</li><li>• 교통 패스 (정기권) 구매</li><li>• 동아리 탐색 및 생필품 구매</li></ul></div>
            <div className="lcard"><h4>학기 중</h4><ul><li>• 중간/기말 고사 준비</li><li>• 아르바이트 (자격외활동허가) 구하기</li><li>• 선배 멘토링 참여</li></ul></div>
          </div>
        </div>
      </section>

      {/* AI 공지 해석기 */}
      <section className="lsec pattern">
        <div className="inner">
          <div className="lnotice">
            <div className="txt">
              <span className="pill-tag">📑 AI 번역 &amp; 분석</span>
              <h3>복잡한 일본어 공지,<br />AI가 바로 해결해 드립니다.</h3>
              <p>학교에서 온 우편물이나 게시판의 일본어 공지문을 스캔하세요. 단순 번역을 넘어, <strong>무엇을, 언제까지 해야 하는지</strong> 실행 가능한 To-Do 리스트로 변환해 줍니다.</p>
              <ul className="steps">
                <li><span className="n">1</span> 카메라로 공지문 촬영</li>
                <li><span className="n">2</span> AI가 핵심 내용 요약 및 번역</li>
                <li><span className="n">3</span> 캘린더 연동 및 할 일 추가</li>
              </ul>
            </div>
            <div className="visual">📄</div>
          </div>
        </div>
      </section>

      {/* AI 선배 멘토 매칭 */}
      <section className="lsec white">
        <div className="inner">
          <div className="sec-head">
            <h2>AI 선배 멘토 매칭</h2>
            <p>나와 같은 길을 걸어간 든든한 선배들을 만나보세요.</p>
          </div>
          <div className="lmentor">
            <div className="left">
              <div className="lcriteria">
                <h4>매칭 기준</h4>
                <ul>
                  <li>같은 대학교 / 학부 <span className="ok">✓</span></li>
                  <li>유사한 진로 목표 <span className="ok">✓</span></li>
                  <li>거주 지역 (관동/관서 등) <span className="ok">✓</span></li>
                  <li>관심사 및 취미 <span className="ok">✓</span></li>
                </ul>
              </div>
              <div className="lmentor-cards">
                {MENTORS.map((m) => (
                  <div className="lmentor-card" key={m.sch}>
                    <div className="ava">🧑‍🎓</div>
                    <div className="sch">{m.sch}</div>
                    <div className="maj">{m.maj}</div>
                    <button className="pb" onClick={onStart}>프로필 보기</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="right" />
          </div>
        </div>
      </section>

      {/* SOS */}
      <section className="lsec lsos">
        <div className="inner">
          <div className="sec-head">
            <h2>지금 도움이 필요해요 SOS</h2>
            <p>긴급 상황이나 빠른 도움이 필요할 때 분야별 전문가와 즉시 연결됩니다.</p>
          </div>
          <div className="lsos-grid">
            {SOS.map((s) => (
              <button className={`lsos-btn ${s.danger ? "danger" : ""}`} key={s.label} onClick={onStart}>
                <span className="ic">{s.ic}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5가지 이유 */}
      <section className="lreasons">
        <div className="inner">
          <h2>다리재팬이 특별한 5가지 이유</h2>
          <div className="lreason-grid">
            {REASONS.map((r) => (
              <div className="lreason" key={r.h}>
                <div className="ic">{r.ic}</div>
                <h4>{r.h}</h4>
                <p>{r.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lfoot">
        <div className="inner">
          <div>
            <div className="brand">DARI JAPAN</div>
            <div className="tag">일본 유학의 첫걸음, AI와 선배가 함께합니다.</div>
          </div>
          <div className="links">
            <a href="#" onClick={(e) => e.preventDefault()}>이용약관</a>
            <a href="#" onClick={(e) => e.preventDefault()}>개인정보처리방침</a>
            <a href="#" onClick={(e) => e.preventDefault()}>고객센터</a>
          </div>
        </div>
        <div className="copy">© 2026 DARI JAPAN. All rights reserved.</div>
      </footer>
    </div>
  );
}
