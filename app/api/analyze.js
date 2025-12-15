export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text needed" });

  // Simple rule-based fallback analysis (no external AI)
  const ltext = text.toLowerCase();
  let intent = "default";
  const keywords = [];
  if (ltext.includes("refund") || ltext.includes("money back")) {
    intent = "billing";
    keywords.push("refund");
  }
  if (ltext.includes("not working") || ltext.includes("bug")) {
    intent = "technical_issue";
    keywords.push("bug");
  }

  const sentiment =
    ltext.includes("not") || ltext.includes("angry") || ltext.includes("hate")
      ? { score: -0.7, label: "negative" }
      : { score: 0.5, label: "positive" };

  const suggestedReply =
    intent === "billing"
      ? "I’m sorry. Please share order ID so we can process your refund."
      : "Thanks for letting us know — can you share more details?";

  return res.status(200).json({ intent, sentiment, suggestedReply, keywords });
}
