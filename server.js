import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if(!OPENAI_KEY){
  console.error("⚠️ Set OPENAI_KEY in environment variables before starting server.");
  process.exit(1);
}

app.post('/api/quickchat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if(!prompt) return res.status(400).json({ error: "No prompt provided." });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role:'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.2
      })
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "No response";
    res.json({ result });

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req,res)=>res.json({ status:'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Proxy running on port ${PORT}`));
