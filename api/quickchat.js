import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    const OPENAI_KEY = process.env.OPENAI_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: "OPENAI_KEY not set" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.2
      })
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
