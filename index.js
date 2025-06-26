const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ role: "user", parts: [{ text: userMessage }] }]
    });

    const botReply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply: botReply });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.get("/", (_, res) => {
  res.send("Gemini proxy is running!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));