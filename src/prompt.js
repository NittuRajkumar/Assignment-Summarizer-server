const promptTemplate = (text) => `You are an assistant that converts unstructured text into strict JSON.

Return ONLY valid JSON in this format:
{
  "summary": "one sentence",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive | neutral | negative"
}

Rules:
- Summary must be exactly one sentence
- KeyPoints must be exactly 3 items
- Sentiment must be one of the allowed values
- No markdown
- No extra text

Text:
${text}`;

module.exports = { promptTemplate };