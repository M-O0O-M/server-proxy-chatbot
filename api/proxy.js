export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Read OPENAI_KEY from Vercel Environment Variables
    const OPENAI_KEY = process.env.OPENAI_KEY;

    if (!OPENAI_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_KEY in Vercel" });
    }

    // Forward the request body (prompt or messages)
    const body = req.body;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Return OpenAI API result back to Chrome Extension
    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Proxy server error" });
  }
}
