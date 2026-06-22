import OpenAI from "openai";
import type { JapanProfile, PlanTask, TaskGuide } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.DARI_MODEL || "gpt-4o";

const VISA_LABEL: Record<string, string> = {
  student: "유학(留学) 비자",
  working_holiday: "워킹홀리데이 비자",
  work: "취업 비자",
  other: "기타",
};

function buildPrompt(profile: JapanProfile, task: PlanTask): string {
  return `당신은 DARI JAPAN, 한국 학생의 일본 유학·정착을 돕는 AI 가이드입니다.
아래 "체크리스트 항목 하나"에 대해, **한국 유학생 맞춤의 구체적이고 실전적인 가이드**를 작성하세요.

# 학생
- 학교/전공: ${profile.schoolMajor || "미입력"}
- 체류 유형: ${VISA_LABEL[profile.visaType] || profile.visaType}

# 대상 항목
- 제목: ${task.titleKo} (${task.titleEn})
- 설명: ${task.description}
- 분류: ${task.category} / 시기: ${task.dueLabel}

# 작성 규칙
- 일본 현지 실무에 맞게 **구체적**으로. "어디서·무엇을·어떤 순서로".
- 한국 학생이 **헷갈리거나 놓치는 점**을 콕 집어줄 것.
- 현장에서 바로 쓸 **일본어 표현**을 2~4개 제시(일본어 + 한국어 뜻).
- 정보 안내이며 법적 자문 아님. 불확실한 마감·요건은 단정하지 말 것.

# 출력 — JSON 객체 하나만. 다른 텍스트·코드펜스 금지:
{
  "overview": string,                  // 한 줄 핵심 (한국어)
  "steps": string[],                   // 단계별 실행 (한국어, 3~6개)
  "documents": string[],               // 필요 서류/준비물 (없으면 [])
  "phrases": [{ "ja": string, "ko": string }],  // 현장 일본어 (2~4개)
  "tips": string[]                     // 한국인 꿀팁/주의 (1~3개)
}`;
}

function parseGuide(raw: string): TaskGuide {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s !== -1 && e !== -1) text = text.slice(s, e + 1);
  const o = JSON.parse(text);
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  return {
    overview: String(o.overview ?? ""),
    steps: arr(o.steps),
    documents: arr(o.documents),
    phrases: Array.isArray(o.phrases)
      ? o.phrases.map((p: Record<string, unknown>) => ({ ja: String(p.ja ?? ""), ko: String(p.ko ?? "") }))
      : [],
    tips: arr(o.tips),
  };
}

export async function POST(req: Request) {
  try {
    const { profile, task } = (await req.json()) as { profile: JapanProfile; task: PlanTask };

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OPENAI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }
    if (!task?.titleKo) {
      return Response.json({ error: "항목 정보가 없습니다." }, { status: 400 });
    }

    const client = new OpenAI();
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: buildPrompt(profile, task) }],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return Response.json(parseGuide(raw));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return Response.json({ error: message }, { status: 500 });
  }
}
