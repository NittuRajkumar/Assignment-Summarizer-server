# AI Text Summarizer

A clean, minimal web app that uses AI to summarize text into structured output: a one-sentence summary, three key points, and sentiment analysis.

## Tech Stack

- **Frontend**: React.js with Vite, functional components, hooks, simple CSS
- **Backend**: Node.js with Express, Google Gemini AI API integration
- **AI**: Google Gemini (e.g., gemini-2.5-flash) for text summarization

## Features

- Input validation
- Real-time summarization
- Structured output display
- Error handling
- Responsive design

## Setup Instructions

1. **Clone or navigate to the project directory**

2. **Backend Setup**
   - Navigate to `server/`
   - Copy `.env.example` to `.env`
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here` (or `GENAI_API_KEY`)
   - Install dependencies: `npm install`
   - Start the server: `npm run dev` (runs on port 5000)

3. **Frontend Setup**
   - Navigate to `client/`
   - Install dependencies: `npm install`
   - Start the dev server: `npm run dev` (runs on port 5173)

4. **Usage**
   - Open the frontend in your browser
   - Enter text in the textarea
   - Click "Summarize" to get results

## API Endpoint

- `POST /api/summarize`
  - Body: `{ "text": "your text here" }`
  - Response: `{ "summary": "...", "keyPoints": ["...", "...", "..."], "sentiment": "positive|neutral|negative" }`

## Prompt Explanation

The AI prompt is designed to return strict JSON output with:
- Exactly one sentence summary
- Exactly three key points
- Sentiment as positive, neutral, or negative
- No extra text or markdown

## Example

Input: "I love this product! It works great and saves me time." 

Output:
```json
{
  "summary": "The user expresses strong satisfaction with the product's performance and time-saving benefits.",
  "keyPoints": [
    "Expresses love for the product",
    "Highlights excellent functionality",
    "Notes time-saving advantages"
  ],
  "sentiment": "positive"
}
```

## Trade-offs

- Uses Gemini API (gemini-2.5-flash) for cost-effectiveness and stability
- Minimal UI to keep focus on functionality
- No authentication for simplicity
- Assumes Google Gemini API availability

## Future Improvements

- Add user authentication
- Support for longer texts with chunking
- Multiple AI models
- Export results to PDF/JSON
- Dark mode
- Batch processing

To run both frontend and backend simultaneously, you can use tools like `concurrently` or run them in separate terminals.
