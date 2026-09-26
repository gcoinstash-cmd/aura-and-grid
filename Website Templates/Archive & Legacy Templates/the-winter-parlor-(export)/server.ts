import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// Lazy initialize GoogleGenAI client (robust pattern to avoid crashing on missing key)
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-Side API Route: Luxury Sensory Curation Proxy via Gemini 3.5 model
  app.post('/api/gemini/curate', async (req, res) => {
    try {
      const { experienceTitle, courses } = req.body;
      if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ error: "No courses selected for curation." });
      }

      // Safe, high-end fallback simulation if no Gemini key is provided, to maintain gorgeous template feel
      if (!process.env.GEMINI_API_KEY) {
        const fallbacks: Record<string, string> = {
          "tasting-1": "This artisanal course pairing matches perfectly with a skin-contact 2021 Skerk Ograde orange wine, providing a rich, honeyed, and mineral backbone that slices through the earthy pecorino peel.",
          "tasting-2": "Complements the dark smoke notes with a cold-poured, carbonic-macerated 2020 Jean-foillard Morgon Beaujolais, imparting intense raspberry and cherry blossom notes without aggressive tannins.",
          "tasting-3": "Highlighted by a sweet, unctuous 10-year Niepoort Tawny Port, introducing direct layers of roasted hazelnut and dried prune to frame the caramelized butter meringue.",
          "tasting-4": "Sustained beautifully with a bone-dry, salt-rimmed 2022 Gut Oggau Theodora white blend, adding unrefined elderflower notes that echo the wild sorrel infusion.",
          "brunch-1": "Elevated by a crisp, pet-nat 2022 Cruse Wine Co. Valdiguié, which brings wild strawberry effervescence to slice through the butter-brushed brioche custard.",
          "brunch-2": "Paired beautifully with a glass of crisp, high-acidity 2021 François Cotat Sancerre Les Monts Damnés, amplifying the bronze dill and rich egg yolk notes.",
          "brunch-3": "Matches the shaving of Périgord black truffle with a glass of unrefined, oxidative 2018 Domaine Overnoy-Houillon Arbois Vin Jaune for profound hazelnut synergy.",
          "brunch-4": "Slightly chilled, unrefined 2021 Christian Tschida Himmel auf Erden white, adding mineral clarity to the Purple-Cherokee tomato purple-velvet oil.",
          "friday-1": "Matches the intense elderberry smoke with an ink-dark, native yeast 2019 Radikon RS Red, yielding structured stone-fruit depth.",
          "friday-2": "Contrasted elegantly by a high-acidity cider blend or a sparkling 2020 Raventós i Blanc Gran Reserva, cutting through five-year aged cheddar cheddar richness.",
          "friday-3": "Accompanied by a late-harvest 2021 Royal Tokaji 5 Puttonyos Aszú, adding dense dried apricot and honeyed layers to the heirloom corn texture.",
          "friday-4": "Paired with a wild, copper-hued 2022 Gravner Anfora Ribolla Gialla, mirroring the Direct Hearth Ember woody warmth."
        };

        return res.json({
          status: "simulated",
          sensoryNarrative: `An exquisite, customized culinary sequence built around ${courses.length} chosen chapters. The flavor flow initiates with unctuous textures, develops under subtle hickory and oakwood smoke, and culminates with a beautiful progression of wild citrus and herbal salts.`,
          pairings: courses.map(course => ({
            courseId: course.id,
            courseName: course.name || course.title,
            wineName: course.id.startsWith('tasting') ? "Biodynamic Cellar Estate Match" : "Wild Ferment Low-Intervention Cuvee",
            wineDesc: fallbacks[course.id] || "Selected specifically to match the unique botanical and flavor profile of this course chapter."
          })),
          harmonyIndex: 98,
          harmonyExplanation: "Absolute synergy established. Combining rich, unctuous proteins and hand-milled wheat with highly dynamic, mineral-forward acidity yields an unbroken sensory flow."
        });
      }

      const ai = getGenAI();

      const prompt = `You are a world-class luxury sommelier and culinary essayist at a high-end, zen-minimalist restaurant concept called "The Winter Parlor".
Analyze the following course selection for the active dining experience: "${experienceTitle}".
Courses chosen:
${courses.map((c, i) => `${i + 1}. [${c.courseNumber || `Course ${i+1}`}] "${c.name || c.title}" - Description: ${c.description}. Price: $${c.price}`).join('\n')}

Based on this flight selection, generate a highly refined sensory and wine-pairing curation in clean JSON format matching the schema requested.
The tone must be high-end, elegant, and literary (but clear and digestible), reflecting luxury hospitality standards (Aura & Grid aesthetic). Avoid generic descriptions or marketing clichés; use natural sensory details (smoky, mineral, bright, botanical, unctuous).
Provide a beautiful, highly specific biodynamic wine pairing for each specific selected course (mention vintage, region, producer, e.g., '2020 Radikon Jakob Orange, Friuli'). Add one elegant sentence explaining why this specific pairing is gorgeous for the dish.
Return exactly of type of Type.OBJECT holding the properties: sensoryNarrative, pairings, harmonyIndex, and harmonyExplanation.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sensoryNarrative: {
                type: Type.STRING,
                description: "A single, highly polished and evocative literary sensory paragraph describing the flavor flow and mood of the chosen courses combined."
              },
              pairings: {
                type: Type.ARRAY,
                description: "A list of custom wine pairings corresponding directly to each of the selected courses.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    courseId: { type: Type.STRING },
                    courseName: { type: Type.STRING },
                    wineName: { type: Type.STRING, description: "A highly specific class/brand or rare biodynamic, low-intervention wine, or craft sake choice (e.g. '2019 Radikon Slatnik Orange, Friuli')." },
                    wineDesc: { type: Type.STRING, description: "One elegant sentence detailing why this pairing unlocks the sensory notes of the course." }
                  },
                  required: ["courseId", "courseName", "wineName", "wineDesc"]
                }
              },
              harmonyIndex: {
                type: Type.INTEGER,
                description: "An editorial gastronomic synergy score from 90 to 100 representing how well the chosen courses compile."
              },
              harmonyExplanation: {
                type: Type.STRING,
                description: "A single concise sentence explaining why these specific dishes compile into an exceptional sitting."
              }
            },
            required: ["sensoryNarrative", "pairings", "harmonyIndex", "harmonyExplanation"]
          }
        }
      });

      const responseText = response.text || "";
      const resultObj = JSON.parse(responseText.trim());
      return res.json({ status: "success", ...resultObj });

    } catch (error: any) {
      console.error("Gemini Curation Error:", error);
      return res.status(500).json({ error: error.message || "Sensory curation failed." });
    }
  });

  // Hot module replacement or static file server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
