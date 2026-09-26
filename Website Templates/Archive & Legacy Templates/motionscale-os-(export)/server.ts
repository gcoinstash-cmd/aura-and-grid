import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialize Gemini client as suggested by dependency guidelines
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY not configured. Running in simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------- API ROUTES -----------------

// API Route: AI Lead Scorer
app.post("/api/gemini/score-lead", async (req, res) => {
  const { name, company, budget, timeline, industry, needs } = req.body;
  
  if (!name || !company) {
    return res.status(400).json({ error: "Lead Name and Company are required." });
  }

  const keyExists = !!process.env.GEMINI_API_KEY;
  if (!keyExists) {
    // Elegant high-fidelity fallback simulation when API key is missing
    const score = Math.min(100, Math.max(30, Math.floor((budget ? budget / 1500 : 50) + (timeline === "Immediate" ? 30 : 10))));
    const tiers = ["Cold Interest", "Qualified Opportunity", "High-Priority Enterprise Prospect"];
    const tier = score > 80 ? tiers[2] : (score > 55 ? tiers[1] : tiers[0]);
    return res.json({
      score,
      tier,
      reasoning: [
        `Prospect exhibits strong profile matching client-avatar matrix with estimated engagement value of $${(budget || 50000).toLocaleString()}.`,
        `Industry profile (${industry || "Technology"}) aligns with Zenith OS high-yield vertical categories.`,
        `Recommendation: Route immediately to Custom VIP Consultation Workflow (Value: $5,000+ impl package).`
      ],
      suggestedStrategy: `Synthesize localized workflow briefs covering the client's core needs: "${needs || "General operational scaling"}". Propose custom ledger and integration layer mapping.`,
      simulated: true
    });
  }

  try {
    const client = getGeminiClient();
    const prompt = `You are an elite, highly sophisticated Enterprise Sales Intelligence Bot scoring a high-ticket business sales lead for a $5,000+ custom implementation consulting tier.
Evaluate the following lead parameters and return a structured JSON evaluation:
Lead Name: ${name}
Company: ${company}
Est. Budget: $${budget ? budget.toLocaleString() : "Unspecified"}
Timeline: ${timeline || "Flexible"}
Industry: ${industry || "Not Specified"}
Operational Needs: ${needs || "Operational optimization"}

Your response MUST be valid JSON matching this schema:
{
  "score": number (between 0 and 100),
  "tier": "string (e.g. Cold Interest, Qualified Opportunity, High-Priority Enterprise Prospect)",
  "reasoning": ["string specifying strategic reason 1", "string specifying strategic reason 2", "string specifying strategic reason 3"],
  "suggestedStrategy": "string (concise bespoke high-converting consulting strategy pitch instructions)"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini lead scoring error:", error);
    res.status(500).json({ error: "Failed to generate AI appraisal. Please check credentials or retry.", details: error.message });
  }
});

// API Route: AI Project Brief Generator
app.post("/api/gemini/generate-brief", async (req, res) => {
  const { projectName, clientName, objectives, techStack, scope } = req.body;

  if (!projectName || !clientName) {
    return res.status(400).json({ error: "Project Name and Client Name are required." });
  }

  const keyExists = !!process.env.GEMINI_API_KEY;
  if (!keyExists) {
    return res.json({
      brief: `# ENTERPRISE SPECIFICATION BRIEF: ${projectName.toUpperCase()}
**Prepared for**: ${clientName}
**Delivery Schedule**: 60 Days Post-Agreement
**Operational Focus**: ${objectives || "Workflow automation, financial consolidation and client containment."}

## 1. STRATEGIC MISSION & OBJECTIVES
Empower ${clientName} to eliminate operational fatigue and optimize cross-departmental throughput.
- Establish a single source of financial and sprint truth.
- Scale resource velocity from current baselines to enterprise standards.

## 2. INTEGRATIVE TECHNICAL LANDSCAPE
- **Orchestration Layer**: robust API pipelines covering ${techStack || "Third-party APIs and custom ledgers"}.
- **Data Model**: Granular role-based controls protecting sensitive structures.
- **Sprint Alignment**: High-frequency resource allocation widgets.

## 3. DESIGNATED SERVICE VALUE
Custom implementation and validation of these modules are valued at **$5,250 USD**. (Recommended pricing standard)`,
      simulated: true
    });
  }

  try {
    const client = getGeminiClient();
    const prompt = `You are a world-class Business Architect and Principal Enterprise Consultant. 
Generate a beautifully structured, highly professional, luxury-grade Project Specification Brief in Markdown format.
Project Title: ${projectName}
Client Entity: ${clientName}
Special Goals & Objectives: ${objectives || "Consolidate operations, improve communication"}
Technical Framework: ${techStack || "Rest APIs, modern CRM relation layers"}
Module Scope Selected: ${scope || "Core CRM, Financial Ledger, Agile Sprint Command, Client Portals"}

Write in a highly authoritative, elite editorial tone. Include structured headers matching executive standards, technical execution definitions, and exact resource-mapping recommendations. Avoid common empty corporate filler, make it crisp and highly actionable so the client readily accepts a $5,000+ implementation invoice. Output just the Markdown string.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ brief: response.text });
  } catch (error: any) {
    console.error("Gemini brief generator error:", error);
    res.status(500).json({ error: "Failed to compile brief.", details: error.message });
  }
});

// API Route: Predictive Financial Advisory
app.post("/api/gemini/analyze-ledger", async (req, res) => {
  const { ledgerItems, pipelineVolume } = req.body;

  const keyExists = !!process.env.GEMINI_API_KEY;
  if (!keyExists) {
    return res.json({
      advisoryReport: `### 📈 ZENITH LEDGER INTELLIGENCE REPORT
**Cash-Flow Integrity**: Excellent (Simulated Mode)
**Predictive Index**: Projected 14.5% quarter-over-quarter growth based on pending pipeline value of $${(pipelineVolume || 350000).toLocaleString()}.

#### Executive Metrics & Diagnostics:
- **Optimization Vector**: Reduce client onboarding friction to capitalize on high-margin enterprise cohorts.
- **Risk Mitigation**: Build solid cash buffers inside the Financial Ledger to cover rapid agile sprint scaling.
- **Recommended Invoice Restructuring**: Pivot standard accounts to upfront milestone billing (50/30/20 standard).`,
      simulated: true
    });
  }

  try {
    const client = getGeminiClient();
    const prompt = `You are an elite automated Chief Financial Officer (CFO) and predictive business analyst.
Review this financial summary:
Current Ledger Items:
${JSON.stringify(ledgerItems || [])}
Pending Deal Pipeline Volume: $${pipelineVolume ? pipelineVolume.toLocaleString() : "Undisclosed"}

Provide a highly concise, 3-4 bullet analysis covering:
1. Cash Flow integrity Diagnostics.
2. A predictive index forecast based on pipeline velocity.
3. Concrete steps to optimize margins and pricing strategies to support the high-ticket $1,000 Gumroad & $5,000 Custom services.
Write in a clean, professional, luxury executive editorial style. Return raw Markdown.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ advisoryReport: response.text });
  } catch (error: any) {
    console.error("Gemini financial analysis error:", error);
    res.status(500).json({ error: "Failed to generate CFO review." });
  }
});


// API Route: Check Gemini Key Health (to show actual credentials visual indicator without exposing values)
app.get("/api/health-check", (req, res) => {
  res.json({
    status: "online",
    geminiKeyDetected: !!process.env.GEMINI_API_KEY,
    currentTime: new Date().toISOString(),
    backupStatus: "Synchronized",
    dbConnection: "Secure local state engine"
  });
});


// ----------------- VITE DEVELOPMENT SERVER OR STATIC SERVING -----------------

async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite server in dev mode to support HMR configuration
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Zenith OS] Server safely running on environment port: ${PORT}`);
  });
}

serveApp();
