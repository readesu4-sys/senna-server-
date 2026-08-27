const API_URL = "https://api.anthropic.com/v1/messages";

/**
 * Panggil Claude API dengan system prompt persona + riwayat pesan.
 * messages: [{ role: 'user' | 'assistant', content: string }, ...]
 */
export async function askSenna({ messages, systemPrompt }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY belum di-set di .env");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const reply = (data.content || [])
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");

  return reply || "...";
}
