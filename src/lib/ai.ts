import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

export async function generateSummary(transcript: string, promptHint?: string): Promise<{
  summary: string;
  actionItems: string[];
}> {
  const hint = promptHint ? ` ${promptHint}` : "";
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a meeting-notes assistant. Given a meeting transcript, respond ONLY with valid JSON of the form " +
          '{"summary": string, "actionItems": string[]}. No markdown, no code fences, no preamble.' + hint,
      },
      { role: "user", content: transcript },
    ],
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary ?? "",
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
    };
  } catch {
    return { summary: cleaned, actionItems: [] };
  }
}

export async function answerFromContext(question: string, contextChunks: string[]): Promise<string> {
  const context = contextChunks.join("\n---\n");
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "Answer the user's question using ONLY the meeting transcript excerpts provided below. " +
          "If the answer isn't in the excerpts, say you don't have that information.\n\n" +
          `Transcript excerpts:\n${context}`,
      },
      { role: "user", content: question },
    ],
    temperature: 0.2,
  });
  return completion.choices[0]?.message?.content ?? "";
}
