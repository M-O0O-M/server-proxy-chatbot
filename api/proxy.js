export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Read body manually (Vercel v2 does NOT auto-parse JSON)
    let rawBody = "";
    for await (const chunk of req) {
      rawBody += chunk;
    }

    let body = {};
    try {
      body = JSON.parse(rawBody || "{}");
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    // Check API key
    const OPENAI_KEY = process.env.OPENAI_KEY;
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_KEY" });
    }

    // Call OpenAI API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55s timeout
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeout);

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error("Proxy failure:", err);
    return res.status(500).json({ error: "Internal Proxy Error" });
  }
}
