import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load local environment secrets
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required in secrets");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ADHD-friendly "Done Enough" analytical agent endpoint
app.post("/api/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "Messy mind dump text is required" });
    return;
  }

  // Gracefully handle missing GEMINI_API_KEY without crashing the server or throwing a 500 error.
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === "") {
    console.warn("[Done Enough Server] GEMINI_API_KEY environment variable is missing or empty. Signalling client to utilize local heuristic engine.");
    res.json({ useLocalHeuristics: true, reason: "GEMINI_API_KEY_MISSING" });
    return;
  }

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are the master ADHD-friendly "Done Enough" finish coach. An executive, developer, or student has dumped their messy thinking process below. They are spiraling, overthinking, or stuck in perfectionism.
      
      Your goal is to parse their brain dump, and REGARDLESS of how chaotic or massive it is, aggressively filter, compress, and truncate all extraneous noise. You must extract ONLY the immediate operational bottleneck for the current single hour. Discard all secondary stages or long-term features as noise to prevent cognitive overload.
      
      User's mind dump:
      "${text}"`,
      config: {
        systemInstruction: "You are a gentle, zen digital coach who understands executive dysfunction and cognitive load. If the user presents a large mind-dump or multi-stage project, always extract ONLY the first core bottleneck for the immediate hour. You MUST start the 'reassuringReason' with the reassuring sentence: 'We archived the rest of the noise. Focus only on this line right now.' followed by why this micro-step is sufficient. You MUST strictly limit the 'subSteps' property to between 3 and 5 hyper-actionable, bite-sized micro-steps. Do not return more than 5 sub-steps.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryStep: {
              type: Type.STRING,
              description: "The absolute next, physical, low-friction action they can do in 5 minutes. Formulated with zero pompous language or corporate speak."
            },
            reassuringReason: {
              type: Type.STRING,
              description: "A short, reassuring, highly compassionate reason why shipping this mini step is highly valuable and legally sufficient for today. Must begin with 'We archived the rest of the noise. Focus only on this line right now.' if the mind-dump contains multiple tasks, stages, or excessive noise."
            },
            subSteps: {
              type: Type.ARRAY,
              description: "Exactly 3 to 5 ridiculously basic, bite-sized tasks that lead to the done state of this action.",
              items: {
                type: Type.STRING
              }
            },
            energyLevel: {
              type: Type.STRING,
              description: "The estimated energy cost. Must be exactly one of: Calm, Steady, High."
            },
            doneEnoughMetric: {
              type: Type.INTEGER,
              description: "The completion percentage that is 'done enough' for today. Usually between 55 and 80 depending on difficulty."
            },
            doneEnoughReason: {
              type: Type.STRING,
              description: "A clear description of exactly what 'done enough' looks like (e.g. '3 rows filled in, formatting left terrible')."
            },
            category: {
              type: Type.STRING,
              description: "The focus area. Must capitalize precisely one of: Creation, Work, Studying, Life, Unclutter."
            }
          },
          required: [
            "primaryStep",
            "reassuringReason",
            "subSteps",
            "energyLevel",
            "doneEnoughMetric",
            "doneEnoughReason",
            "category"
          ]
        }
      }
    });

    const rawResponseText = response.text;
    if (!rawResponseText) {
      throw new Error("No response output returned from Gemini AI");
    }

    const structuredData = JSON.parse(rawResponseText.trim());

    // Defensive cognitive protection: enforce 3 to 5 tasks regardless of model generation
    if (structuredData.subSteps && Array.isArray(structuredData.subSteps)) {
      structuredData.subSteps = structuredData.subSteps.slice(0, 5);
      
      // Ensure minimum 3 steps
      if (structuredData.subSteps.length < 3) {
        while (structuredData.subSteps.length < 3) {
          structuredData.subSteps.push("Take a brief 30-second breath break to stabilize focus");
        }
      }
    } else {
      structuredData.subSteps = [
        "Write down the single first word or element on the workspace",
        "Set a simple 5-minute sandbox timer to start moving",
        "Take a brief 30-second breath break to stabilize focus"
      ];
    }

    // Double check reassuringReason prefix if massive load
    const isMasiveInput = text.length > 200 || text.split("\n").length >= 3 || text.includes(",") || text.includes(";");
    if (isMasiveInput && structuredData.reassuringReason) {
      const prefix = "We archived the rest of the noise. Focus only on this line right now.";
      if (!structuredData.reassuringReason.includes("archived the rest of the noise")) {
        structuredData.reassuringReason = `${prefix} ${structuredData.reassuringReason}`;
      }
    }

    res.json(structuredData);

  } catch (err: any) {
    console.error("Gemini server-side analysis failed:", err);
    res.status(500).json({
      error: "Could not contact flow coach. Using local resilience failsafe fallback.",
      details: err.message
    });
  }
});

// Configure Vite middleware or static serving
async function setupVite() {
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
    console.log(`[Done Enough Server] Active on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
