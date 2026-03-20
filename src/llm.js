// const OpenAI = require('openai');
// const { promptTemplate } = require('./prompt');

// async function summarizeText(text) {
//   if (!process.env.OPENAI_API_KEY) {
//     throw new Error('OpenAI API key not configured');
//   }
//   const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });
//   const prompt = promptTemplate(text);
//   const response = await client.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: prompt }],
//   });
//   const content = response.choices[0].message.content.trim();
//   try {
//     const result = JSON.parse(content);
//     // Validate structure
//     if (!result.summary || !Array.isArray(result.keyPoints) || result.keyPoints.length !== 3 || !['positive', 'neutral', 'negative'].includes(result.sentiment)) {
//       throw new Error('Invalid response structure');
//     }
//     return result;
//   } catch (error) {
//     throw new Error('Failed to parse LLM response');
//   }
// }

// module.exports = { summarizeText };


const { GoogleGenAI } = require("@google/genai");
const { promptTemplate } = require("./prompt");

async function summarizeText(text) {
  const apiKey = process.env.GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API key not configured. Set GENAI_API_KEY or GEMINI_API_KEY in .env");
  }

  if (!text || !text.trim()) {
    throw new Error("Text is required for summarization");
  }

  const envModel = (process.env.GENAI_MODEL || process.env.GEMINI_MODEL || "").trim();
  const modelId = envModel && !/gemini-pro/i.test(envModel) ? envModel : "gemini-2.5-flash";

  console.log(`Using model for summarization: ${modelId}`);

  const ai = new GoogleGenAI({ apiKey });

  const prompt = promptTemplate(text);

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      maxOutputTokens: 256,
      temperature: 0.2,
    },
  });

  const content = (response?.text || response?.output?.[0]?.content || response?.candidates?.[0]?.content || "").trim();

  if (!content) {
    throw new Error("Empty response from Gemini API");
  }

  let parsed;
  const tryParse = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  parsed = tryParse(content);

  if (!parsed) {
    // Fallback: try to find the first JSON object in the text
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      parsed = tryParse(objectMatch[0]);
    }
  }

  if (!parsed) {
    // If we still can't parse, provide a safe fallback object.
    console.warn("Could not parse JSON from model output, returning fallback summary.", content);
    return {
      summary: content.replace(/\n+/g, " ").slice(0, 1000),
      keyPoints: [],
      sentiment: "neutral",
    };
  }

  if (
    !parsed.summary ||
    !Array.isArray(parsed.keyPoints) ||
    parsed.keyPoints.length !== 3 ||
    !["positive", "neutral", "negative"].includes(parsed.sentiment)
  ) {
    console.warn("Parsed model output has invalid structure; returning fallback.", parsed);
    return {
      summary: parsed.summary || content.replace(/\n+/g, " ").slice(0, 1000),
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 3) : [],
      sentiment: ["positive", "neutral", "negative"].includes(parsed.sentiment) ? parsed.sentiment : "neutral",
    };
  }

  return parsed;
}

module.exports = { summarizeText };