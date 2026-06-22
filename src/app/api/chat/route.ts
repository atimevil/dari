import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/prompt";
import type { ChatMessage, DariAnswer, Lang, Profile } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.DARI_MODEL || "gpt-4o";

// 모델이 코드펜스/잡텍스트를 붙여도 견고하게 JSON만 추출
function parseAnswer(raw: string): DariAnswer {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  const obj = JSON.parse(text);
  return {
    answer: String(obj.answer ?? ""),
    checklist: Array.isArray(obj.checklist) ? obj.checklist.map(String) : [],
    documents: Array.isArray(obj.documents) ? obj.documents.map(String) : [],
    deadline: String(obj.deadline ?? ""),
    sources: Array.isArray(obj.sources) ? obj.sources.map(String) : [],
    escalate: Boolean(obj.escalate),
    escalateReason: String(obj.escalateReason ?? ""),
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      profile: Profile;
      language: Lang;
      messages: ChatMessage[];
    };
    const { profile, language, messages } = body;

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다. .env.local 을 확인하세요." },
        { status: 500 }
      );
    }
    if (!messages?.length) {
      return Response.json({ error: "messages가 비어 있습니다." }, { status: 400 });
    }

    const system = buildSystemPrompt(profile, language);

    const oaMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...messages.map(
        (m): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
          role: m.role,
          content: m.content,
        })
      ),
    ];

    const client = new OpenAI();
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      response_format: { type: "json_object" }, // JSON 모드 (프롬프트에 "JSON" 명시되어 있음)
      messages: oaMessages,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const answer = parseAnswer(raw);
    return Response.json(answer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return Response.json({ error: message }, { status: 500 });
  }
}
