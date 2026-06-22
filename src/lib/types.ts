// 다리(DARI) 공통 타입

export type Lang = "ko" | "zh" | "vi" | "en";

export interface Profile {
  visaType: string;      // 예: "D-2-2 (학사)"
  entryDate: string;     // YYYY-MM-DD
  visaExpiry: string;    // YYYY-MM-DD
  registered: boolean;   // 외국인등록 완료 여부
  school: string;
  partTime: boolean;     // 현재 아르바이트(시간제취업) 중 여부
}

// 채팅 API 메시지 (Claude 컨텍스트용)
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// 구조화된 답변 (UI 렌더링용)
export interface DariAnswer {
  answer: string;
  checklist: string[];
  documents: string[];
  deadline: string;
  sources: string[];
  escalate: boolean;
  escalateReason: string;
}

// ===== DARI JAPAN — 온보딩 & 개인화 플랜 =====

export interface JapanProfile {
  schoolMajor: string;                                       // "도쿄대학교 경제학부"
  visaType: "student" | "working_holiday" | "work" | "other";
  arrivalDate: string;                                       // YYYY-MM-DD
}

export type PlanPhase = "before" | "arrival" | "settling";

export interface PlanTask {
  id: string;
  titleKo: string;       // 한국어 제목
  titleEn: string;       // 영문 제목
  description: string;   // 무엇을·어떻게 (실행 가능한 안내)
  phase: PlanPhase;      // 입국 전 / 도착 직후 / 정착 중
  category: string;      // 서류·비자·주거·행정·학업·금융·생활 등
  dueLabel: string;      // "입국 2주 전", "도착 14일 이내" 등
  priority: "high" | "normal";
}

export interface JapanPlan {
  summary: string;       // 한 줄 요약
  tasks: PlanTask[];
}

export const PHASE_LABEL: Record<PlanPhase, string> = {
  before: "입국 전",
  arrival: "도착 직후",
  settling: "첫 학기",
};

// ===== 항목별 AI 가이드 =====

export interface GuidePhrase {
  ja: string; // 현장에서 쓸 일본어
  ko: string; // 한국어 뜻
}

export interface TaskGuide {
  overview: string;        // 한 줄 핵심
  steps: string[];         // 단계별 실행
  documents: string[];     // 필요 서류/준비물
  phrases: GuidePhrase[];  // 현장 일본어 표현
  tips: string[];          // 한국인이 흔히 놓치는 점/꿀팁
}
