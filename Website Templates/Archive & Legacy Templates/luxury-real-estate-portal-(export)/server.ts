/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-load Gemini client to prevent crashes if key is omitted on boot
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required for Gemini operations.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// ------------------ API ROUTES ------------------

// 1. Generate Bespoke Luxury Description & Amenities
app.post("/api/gemini/generate-description", async (req, res) => {
  try {
    const { title, location, price, bedrooms, bathrooms, sqft, userPrompt } = req.body;
    const ai = getGeminiClient();

    const statsContext = `
Title: ${title || "Proposed Asset"}
Location: ${location || "Exclusive Sector"}
Price: $${price ? Number(price).toLocaleString() : "Undisclosed"}
Specifications: ${bedrooms || 3} bedrooms, ${bathrooms || 2.5} bathrooms, ${sqft || 3500} sqft
User Preferences: ${userPrompt || "Focus on brutalist monolith aesthetics, high-contrast concrete and glass, and seamless transitions between indoor and outdoor sanctuaries."}
    `;

    const prompt = `
Generate a luxurious, highly literary architectural description and recommend exactly 5 premium, structural amenities.
Property Details:
${statsContext}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite real-estate copywriter and architectural critic. Craft compelling descriptions with a high-end, obsidian-modern, brutalist design vocabulary. Avoid sales-pitch clichés or generic high-quality words.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "Literary, evocative write-up describing the architectural identity, materials, light, and natural balance."
            },
            suggestedAmenities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 extremely modern, exclusive structural or technical highlights (e.g. 'Geothermal onsen plunge', 'Biometric privacy lockouts', 'Monolithic concrete hearth')."
            },
            recommendedPriceAdvice: {
              type: Type.STRING,
              description: "Brief professional appraisal advice explaining why this estate warrants the high price based on structural features."
            }
          },
          required: ["description", "suggestedAmenities", "recommendedPriceAdvice"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, ...parsedData });
  } catch (error: any) {
    console.error("Gemini description generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate property specifications." });
  }
});

// 2. Document Vault Smart Risk Analyzer & Summarizer
app.post("/api/gemini/analyze-document", async (req, res) => {
  try {
    const { title, category } = req.body;
    const ai = getGeminiClient();

    const prompt = `
Generate a comprehensive simulated risk analysis and parameter verification for the following transaction record.
Title: ${title}
Category: ${category}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the chief legal compliance audit bot at Obsidian Portal, verifying high-profile corporate real estate deeds and elite tenant agreements. Simulate an accurate legal verification report.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional executive summary outlining what this legal instrument guarantees, who the parties are, and lease conditions."
            },
            keyClauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 key simulated clauses or financial covenant summaries (e.g., security deposit hold, maintenance response SLA)."
            },
            securityCompliance: {
              type: Type.STRING,
              description: "Statement regarding confidentiality, digital biometric signature validity, and compliance checks passed."
            },
            riskCategory: {
              type: Type.STRING,
              description: "One of: 'Low Secure', 'Standard Approved', or 'Priority Auditor Review Needed'"
            }
          },
          required: ["summary", "keyClauses", "securityCompliance", "riskCategory"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, ...parsedData });
  } catch (error: any) {
    console.error("Gemini document analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to audit document structure." });
  }
});

// 3. Concierge Advisory Portal (Contextual Property Q&A)
app.post("/api/gemini/consultation-chat", async (req, res) => {
  try {
    const { properties, messages, currentMessage } = req.body;
    const ai = getGeminiClient();

    const propertiesContext = properties.map((p: any) => `
ID: ${p.id}
Title: ${p.title}
Location: ${p.location}
Price: $${p.price.toLocaleString()}
Specifications: ${p.bedrooms} Beds, ${p.bathrooms} Baths, ${p.sqft} Sqft
Description: ${p.description}
Amenities: ${p.amenities ? p.amenities.join(", ") : ""}
----------------------------------
`).join("\n");

    const chatMessages = [
      {
        role: "user",
        parts: [{ text: `Here is the full directory of exclusive available properties on the Obsidian Portal:
${propertiesContext}` }]
      }
    ];

    // Add chat history
    if (messages && messages.length > 0) {
      messages.forEach((msg: any) => {
        chatMessages.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      });
    }

    // Append latest prompt
    chatMessages.push({
      role: "user",
      parts: [{ text: currentMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatMessages as any,
      config: {
        systemInstruction: "You are the Obsidian Portal Private Concierge. You guide clients and brokers with absolute discretion, sophisticated design knowledge, and professional real estate acumen. Provide deep insights about the available homes. Keep responses elegant, structured, clear and under 250 words. Format with clean markup. Never recommend properties not in the supplied directory, but guide users proudly to those.",
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Gemini concierge chat error:", error);
    res.status(500).json({ error: error.message || "Concierge AI is currently offline." });
  }
});


// ------------------ VITE / PRODUCTION INTEGRATION ------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
