import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini API
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenAI({ apiKey });
};

// API Endpoints
app.post("/api/verify", async (req, res) => {
  const { text, url } = req.body;

  if (!text && !url) {
    return res.status(400).json({ error: "Text or URL is required" });
  }

  try {
    const ai = getAI();
    const model = "gemini-flash-latest";
    const prompt = `
      Analyze the following news content for authenticity.
      Classification: Authentic, Misleading, or Fake.
      Provide a confidence score (0-100).
      
      CRITICAL: Provide a detailed breakdown of the 'evidence'. 
      For each piece of evidence:
      1. Extract the exact 'phrase' or snippet from the content.
      2. Provide a clear 'explanation' of why this snippet contributes to the classification.
      3. Determine the 'sentiment' of the snippet (Positive, Negative, or Neutral).
      4. Categorize the evidence 'type'.

      Content: ${text || url}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { type: Type.STRING, enum: ["Authentic", "Misleading", "Fake"] },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            evidence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                  type: { type: Type.STRING }
                },
                required: ["phrase", "explanation", "sentiment", "type"]
              }
            },
            sourceCredibility: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                details: { type: Type.STRING }
              }
            }
          },
          required: ["classification", "confidence", "reasoning", "evidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Verification Error:", error);
    let message = error.message || "Failed to verify news";
    if (message.includes("API key not valid") || message.includes("INVALID_ARGUMENT")) {
      message = "The provided Gemini API key is invalid.";
    }
    res.status(500).json({ error: message });
  }
});

let cachedNews: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

app.get("/api/news-feed", async (req, res) => {
  const now = Date.now();
  if (cachedNews && (now - lastFetchTime < CACHE_DURATION)) {
    return res.json(cachedNews);
  }

  try {
    const ai = getAI();
    const model = "gemini-flash-latest";
    const prompt = `
      Fetch the top 5 most recent and significant global news headlines from the last 24 hours.
      Provide the response as a JSON array of objects.
      Each object must have: title, description, url, source, publishedAt (ISO string), and an optional image URL.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              url: { type: Type.STRING },
              source: { type: Type.STRING },
              publishedAt: { type: Type.STRING },
              image: { type: Type.STRING }
            },
            required: ["title", "description", "url", "source", "publishedAt"]
          }
        }
      }
    });

    cachedNews = JSON.parse(response.text || "[]");
    lastFetchTime = now;
    res.json(cachedNews);
  } catch (error: any) {
    console.error("News Feed Error:", error);
    if (cachedNews) return res.json(cachedNews);
    
    let message = error.message || "Failed to fetch news feed";
    if (message.includes("429") || message.includes("quota")) {
      message = "API Quota exceeded. Please try again in a few minutes.";
    } else if (message.includes("API key not valid") || message.includes("INVALID_ARGUMENT")) {
      message = "The provided Gemini API key is invalid.";
    }
    res.status(500).json({ error: message });
  }
});

export default app;
