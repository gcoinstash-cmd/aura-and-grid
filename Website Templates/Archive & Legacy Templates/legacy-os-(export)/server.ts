import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features might fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Integration Endpoints
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { documentName, contentText } = req.body;
    if (!contentText || contentText.trim() === "") {
      return res.status(400).json({ error: "Document content is required for summarization." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are an elite legal and operational advisor for Legacy OS, advising high-ticket Black agency owners, digital creators, and elite entrepreneurs. 
Summarize the provided contract text or client asset description into a highly organized, elegant, bulleted premium summary. 
Focus on:
1. Operational Deliverables & Key Milestones
2. Financial Terms, Royalties, or Revenue Shares
3. Intellectual Property Rights & Asset Ownership
4. Recommended Next Steps or Potential Risk Areas and strategies to mitigate.

Ensure the tone is sophisticated, sophisticated, professional, and empowering. Respond in well-structured Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please summarize this client asset/contract titled "${documentName || 'Unnamed Asset'}":\n\n${contentText}`,
      config: {
        systemInstruction,
        temperature: 0.35,
      }
    });

    const summaryText = response.text || "No summary was generated. Please verify the input text.";
    res.json({ text: summaryText });
  } catch (error: any) {
    console.error("Gemini Summarize Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during summarization." });
  }
});

app.post("/api/gemini/copywrite", async (req, res) => {
  try {
    const { targetAudience, offerDetails, campaignType } = req.body;
    if (!offerDetails) {
      return res.status(400).json({ error: "Offer details and target audience are required." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are a legendary luxury copywriter and brand strategist who writes high-ticket client copy that exudes prestige, authority, and lineage. 
Write a high-converting copywriting pitch asset (e.g. cold outbound luxury pitch, elite retainer closing email, or creator platform partnership request) based on the inputs provided.
Deliver a masterpiece containing:
1. A showstopping title or subject line.
2. A compelling frame of value aligning the founder's legacy with the recipient's high-intent goals.
3. Crystal-clear value proposition of the custom offer.
4. An elite, low-pressure yet high-conviction Call to Action.

Tone: Black excellence, sophisticated minimalist posture, elite conviction. Response format should be beautiful, clean Markdown.`;

    const prompt = `Campaign Type: ${campaignType || 'Outbound Retainer Pitch'}
Target Audience/Partner: ${targetAudience || 'Ultra-high-net-worth investors or Fortune 500 decision makers'}
Core Offer Details: ${offerDetails}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    const pitchText = response.text || "No copywriting pitch was generated.";
    res.json({ text: pitchText });
  } catch (error: any) {
    console.error("Gemini Copywrite Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during copy generation." });
  }
});

// Vite Server Configuration
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Legacy OS Server is online on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start server:", err);
});
