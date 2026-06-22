"use client";

import { Icon } from "./icons";

const ONBOARD = [
  { ic: "graduation-cap", h: "학교 및 전공 입력", p: "진학 예정인 대학교와 전공을 입력하여 맞춤 정보를 받습니다." },
  { ic: "calendar", h: "입국일 설정", p: "출국 및 입국 일정에 맞춰 D-Day 플랜이 자동 생성됩니다." },
  { ic: "clipboard-list", h: "맞춤 플랜 생성", p: "비자, 주거, 수강신청 등 필수 단계별 플랜이 제공됩니다." },
];

const REASONS = [
  { ic: "target", h: "개인 맞춤형", p: "내 상황에 꼭 맞는 정보만 선별 제공" },
  { ic: "zap", h: "행동 중심", p: "단순 정보가 아닌 구체적인 실행 플랜" },
  { ic: "compass", h: "전체 흐름 관리", p: "입국 전부터 첫 학기 적응까지 단계별 케어" },
  { ic: "activity", h: "적응 상태 점검", p: "체크리스트로 진행률을 한눈에 관리" },
];

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="landing">
      <header className="lhead">
        <img className="llogo" src="/dari-logo.png" alt="DARI JAPAN" />
        <button className="lbtn primary" onClick={onStart}>시작하기</button>
      </header>

      {/* Hero */}
      <section className="lhero">
        <div className="lhero-glow" aria-hidden />
        <div className="lhero-inner">
          <span className="badge"><Icon name="graduation-cap" size={15} /> 유학생 맞춤형 솔루션</span>
          <h1>일본 유학의 첫걸음,<br /><span className="accent">AI가 끝까지 함께합니다</span></h1>
          <p className="sub">복잡한 서류 준비부터 현지 정착, 학업 적응까지. 다리재팬이 당신의 든든한 다리가 되어드립니다.</p>
          <div className="cta-row">
            <button className="lbtn primary" onClick={onStart}>지금 시작하기 <Icon name="arrow-right" size={18} /></button>
            <button className="lbtn ghost" onClick={onStart}>서비스 둘러보기</button>
          </div>
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
            {ONBOARD.map((c) => (
              <div className="lcard" key={c.h}>
                <div className="ic"><Icon name={c.ic} size={26} /></div>
                <h4>{c.h}</h4>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 시기별 적응 체크리스트 */}
      <section className="lsec">
        <div className="inner">
          <div className="sec-head">
            <h2>시기별 적응 체크리스트</h2>
            <p>입국 전부터 첫 학기까지 놓치지 말아야 할 필수 항목들입니다.</p>
          </div>
          <div className="lcheck-row">
            <div className="lvisual v-indigo">
              <div className="lvisual-ic"><Icon name="plane" size={36} /></div>
              <span className="lvisual-cap">입국 전 준비</span>
            </div>
            <div className="lcheck-body">
              <h4>입국 전</h4>
              <ul>
                <li><span className="ck"><Icon name="check" size={16} /></span> 비자 발급 및 서류 준비</li>
                <li><span className="ck"><Icon name="check" size={16} /></span> 주거 계약 및 항공권 예약</li>
                <li><span className="ck"><Icon name="check" size={16} /></span> 짐 준비</li>
              </ul>
            </div>
          </div>
          <div className="lcheck-cards">
            <div className="lcard phase">
              <span className="ph-tag">도착 직후</span>
              <ul><li>재류카드 발급 · 주민등록</li><li>휴대폰 개통 · 은행 계좌 개설</li><li>국민건강보험 가입</li></ul>
            </div>
            <div className="lcard phase">
              <span className="ph-tag">첫 학기</span>
              <ul><li>수강신청 및 오리엔테이션</li><li>교통패스 발급 · 동아리 가입</li><li>아르바이트 정보 확인</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI 공지 해석기 */}
      <section className="lsec pattern">
        <div className="inner">
          <div className="lnotice">
            <div className="txt">
              <span className="pill-tag"><Icon name="scan-text" size={15} /> AI 번역 &amp; 분석</span>
              <h3>복잡한 일본어 공지,<br />AI가 바로 해결해 드립니다.</h3>
              <p>학교에서 온 우편물이나 게시판의 일본어 공지문을 스캔하세요. 단순 번역을 넘어, <strong>무엇을, 언제까지 해야 하는지</strong> 실행 가능한 To-Do 리스트로 변환해 줍니다.</p>
              <ul className="steps">
                <li><span className="n">1</span> 카메라로 공지문 촬영 또는 업로드</li>
                <li><span className="n">2</span> AI가 핵심 내용 요약 및 한국어 번역</li>
                <li><span className="n">3</span> 캘린더 연동 및 할 일 추가</li>
              </ul>
            </div>
            <div className="lvisual v-dark">
              <div className="lvisual-ic"><Icon name="scan-text" size={40} /></div>
              <span className="lvisual-cap">공지문 스캔 → To-Do</span>
            </div>
          </div>
        </div>
      </section>

      {/* 특별한 이유 */}
      <section className="lreasons">
        <div className="inner">
          <h2>다리재팬이 특별한 4가지 이유</h2>
          <div className="lreason-grid">
            {REASONS.map((r) => (
              <div className="lreason" key={r.h}>
                <div className="ic"><Icon name={r.ic} size={26} /></div>
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
            <img className="lfoot-logo" src="/dari-logo.png" alt="DARI JAPAN" />
            <div className="tag">일본 유학의 첫걸음, AI가 끝까지 함께합니다.</div>
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
