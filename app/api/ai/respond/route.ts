// app/api/ai/respond/route.ts
import { NextResponse } from "next/server";

async function callOpenAI(messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.2,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function POST(req: Request) {
  try {
    const { text, recentMessages } = await req.json();
    if (!text)
      return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const messages = [
      {
        role: "system",
        content:
          "You are a concise customer support assistant. Keep replies short (1-3 sentences). Decide if the message requires escalation to a human agent: set 'escalate' to true for angry tone, account/billing changes, or when the user explicitly requests an agent. Respond in JSON only with keys: reply (string), confidence (0.0-1.0), escalate (true|false), reason (short string).",
      },
      ...(Array.isArray(recentMessages) ? recentMessages.slice(-6) : []),
      { role: "user", content: text },
      {
        role: "user",
        content: `Now output STRICT JSON only, example:
{"reply":"Short reply text","confidence":0.85,"escalate":false,"reason":"none"}`,
      },
    ];

    let parsed;
    try {
      const ai = await callOpenAI(messages);
      const content = ai.choices?.[0]?.message?.content || "";
      parsed = JSON.parse(content);
      // Normalize basic fields
      parsed.reply = String(
        parsed.reply || "Thanks — we'll get back to you shortly."
      );
      parsed.confidence = Number(parsed.confidence ?? 0.5);
      parsed.escalate = Boolean(parsed.escalate);
      parsed.reason = String(
        parsed.reason ||
          (parsed.escalate ? "Model suggested escalation" : "none")
      );
    } catch (err) {
      // Fallback
      parsed = {
        reply:
          "Thanks for contacting support. An agent will review this and reply shortly.",
        confidence: 0.5,
        escalate: true,
        reason: "Fallback due to parsing or model error",
      };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("AI respond error:", err);
    return NextResponse.json(
      { error: err.message || "unknown" },
      { status: 500 }
    );
  }
}
