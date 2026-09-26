import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock Instagram API endpoint
  app.get("/api/instagram", (req, res) => {
    // Simulating a live feed from @NEON_LOTUS
    const mockPosts = [
      {
        id: "post1",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
        caption: "Noodles with a side of neon. #NeonLotus",
        category: "food",
        likes: 1240,
        comments: 42
      },
      {
        id: "post2",
        imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&q=80&w=800",
        caption: "Wok Hei in full effect. 🔥",
        category: "food",
        likes: 890,
        comments: 12
      },
      {
        id: "post3",
        imageUrl: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=800",
        caption: "Dimension of flavor. #DimSum",
        category: "food",
        likes: 2100,
        comments: 89
      },
      {
        id: "post4",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
        caption: "Late night vibes in the city.",
        category: "city",
        likes: 1560,
        comments: 34
      },
      {
        id: "post5",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        caption: "Crisp and fresh Tofu. #Organic",
        category: "food",
        likes: 760,
        comments: 5
      },
      {
        id: "post6",
        imageUrl: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?auto=format&fit=crop&q=80&w=800",
        caption: "City lights and Lotus nights.",
        category: "city",
        likes: 3400,
        comments: 120
      },
      {
        id: "post7",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        caption: "Private event setup for tonight's gala.",
        category: "events",
        likes: 1800,
        comments: 45
      },
      {
        id: "post8",
        imageUrl: "https://images.unsplash.com/photo-1544434547-8a6c8135839b?auto=format&fit=crop&q=80&w=800",
        caption: "Late night cravings satisfied. 🥢",
        category: "food",
        likes: 2900,
        comments: 67
      }
    ];
    res.json(mockPosts);
  });

  // Vite middleware for development
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
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
