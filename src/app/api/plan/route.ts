import OpenAI from "openai";
import type { JapanPlan, JapanProfile, PlanTask } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.DARI_MODEL || "gpt-4o";

const VISA_LABEL: Record<string, string> = {
  student: "유학(留学) 비자",
  working_holiday: "워킹홀리데이 비자",
  work: "취업 비자",
  other: "기타",
};

function buildPrompt(profile: JapanProfile, today: string): string {
  return `당신은 DARI JAPAN, 한국 학생의 일본 유학·정착을 돕는 AI입니다.
아래 학생 정보를 바탕으로 **개인화된 시기별 준비 체크리스트(플랜)**를 생성하세요.

# 학생 정보
- 학교/전공: ${profile.schoolMajor || "미입력"}
- 체류 유형: ${VISA_LABEL[profile.visaType] || profile.visaType}
- 입국 예정일: ${profile.arrivalDate || "미입력"} (오늘: ${today})

# 작성 규칙
- 일본 유학·체류 실무에 맞는 **구체적이고 실행 가능한** 항목만. 일반론 금지.
- 체류 유형에 맞게 개인화(예: 유학 비자면 在留카드·자격외활동허가, 워홀이면 다른 절차).
- 일본 특유 항목을 반드시 반영: 在留카드 수령·주소등록(구청 14일 내), 국민건강보험, 마이넘버, 휴대폰·은행계좌, 자격외활동허가(아르바이트), 교통 정기권, 수강신청 등.
- 총 10~14개 항목을 3단계(phase)에 고루 분배: before(입국 전)·arrival(도착 직후)·settling(첫 학기 — 수강신청·교통패스·동아리·아르바이트 등).
- 이건 정보 안내이며 법적 자문이 아님. 불확실한 마감은 단정하지 말 것.

# 출력 형식 — JSON 객체 하나만. 다른 텍스트·코드펜스 금지:
{
  "summary": string,            // 한 줄 요약 (한국어)
  "tasks": [
    {
      "id": string,             // 짧은 슬러그 (예: "residence-card")
      "titleKo": string,        // 한국어 제목
      "titleEn": string,        // 영문 제목
      "description": string,    // 무엇을·어떻게 (한국어, 1~2문장)
      "phase": "before" | "arrival" | "settling",
      "category": string,       // 서류·비자·주거·행정·학업·금융·생활 중
      "dueLabel": string,       // "입국 2주 전" / "도착 14일 이내" / "첫 주" 등
      "priority": "high" | "normal"
    }
  ]
}`;
}

function parsePlan(raw: string): JapanPlan {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s !== -1 && e !== -1) text = text.slice(s, e + 1);
  const obj = JSON.parse(text);
  const tasks: PlanTask[] = Array.isArray(obj.tasks)
    ? obj.tasks.map((t: Record<string, unknown>, i: number) => ({
        id: String(t.id ?? `task-${i}`),
        titleKo: String(t.titleKo ?? ""),
        titleEn: String(t.titleEn ?? ""),
        description: String(t.description ?? ""),
        phase: (["before", "arrival", "settling"].includes(String(t.phase)) ? t.phase : "before") as PlanTask["phase"],
        category: String(t.category ?? ""),
        dueLabel: String(t.dueLabel ?? ""),
        priority: t.priority === "high" ? "high" : "normal",
      }))
    : [];
  return { summary: String(obj.summary ?? ""), tasks };
}

export async function POST(req: Request) {
  try {
    const { profile } = (await req.json()) as { profile: JapanProfile };

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다. .env.local 을 확인하세요." },
        { status: 500 }
      );
    }
    if (!profile?.arrivalDate || !profile?.schoolMajor) {
      return Response.json({ error: "학교/전공과 입국 예정일을 입력하세요." }, { status: 400 });
    }

    const client = new OpenAI();
    const today = new Date().toISOString().slice(0, 10);
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: buildPrompt(profile, today) }],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return Response.json(parsePlan(raw));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return Response.json({ error: message }, { status: 500 });
  }
}
