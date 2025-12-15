// app/api/ai/analyze/route.ts
import { NextResponse } from "next/server";

// Small keyword map fallback
const ROUTING_KEYWORDS: Record<string, string> = {
  payment: "billing",
  invoice: "billing",
  refund: "billing",
  login: "tech",
  password: "tech",
  error: "tech",
  delivery: "logistics",
  shipped: "logistics",
  "not received": "logistics",
  cancel: "orders",
  order: "orders",
  billing: "billing",
  support: "general",
};

async function callOpenAI(prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
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
    const body = await req.json();
    const text = (body?.text || "").toString().trim();
    if (!text)
      return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const prompt = `
You are a compact assistant. Given a single customer message, produce strict JSON with these keys:
- sentiment: one of "angry", "neutral", "happy"
- keywords: array of up to 5 short keywords (strings)
- department: one of "billing","tech","logistics","orders","general"
- reason: one short sentence explaining the department choice

Return JSON ONLY.

Message:
"""${text}"""
`;

    let parsed = null;
    try {
      const ai = await callOpenAI(prompt);
      const content = ai.choices?.[0]?.message?.content || "";
      parsed = JSON.parse(content);
      // Basic sanity checks
      if (!parsed?.sentiment || !parsed?.department)
        throw new Error("Missing keys");
      // Normalize
      parsed.keywords = Array.isArray(parsed.keywords)
        ? parsed.keywords.slice(0, 5)
        : [];
      parsed.sentiment = parsed.sentiment.toString().toLowerCase();
      parsed.department = parsed.department.toString().toLowerCase();
    } catch (err) {
      // Fallback heuristic
      const lower = text.toLowerCase();
      let dept = "general";
      for (const k of Object.keys(ROUTING_KEYWORDS)) {
        if (lower.includes(k)) {
          dept = ROUTING_KEYWORDS[k];
          break;
        }
      }
      const words = (text.match(/\b[a-zA-Z0-9']+\b/g) || []).slice(0, 5);
      parsed = {
        sentiment: "neutral",
        keywords: words,
        department: dept,
        reason: "Fallback heuristic matched keywords",
      };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("AI analyze error:", err);
    return NextResponse.json(
      { error: err.message || "unknown" },
      { status: 500 }
    );
  }
}
