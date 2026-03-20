console.log("=== START DEBUG ===");try { const pkg = require("@google/genai"); console.log("Using @google/genai ");} catch (e) { console.log("NOT using @google/genai ");}try { const oldPkg = require("@google/generative-ai"); console.log("Old SDK STILL PRESENT ");} catch (e) { console.log("Old SDK not found ");}console.log("=== END DEBUG ===");



const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { summarizeText } = require('./llm');
const { validateInput } = require('./validate');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    validateInput(text);
    const result = await summarizeText(text);
    res.json(result);
  } catch (error) {
    console.error('Error:', error.message);
    const status = error.message.includes('Invalid input') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});