import express from "express";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On s'assure que data.json est toujours à la racine du projet, pas dans dist/
const PROJECT_ROOT = process.env.NODE_ENV === "production" ? path.join(__dirname, "..") : __dirname;
const DATA_FILE = path.join(PROJECT_ROOT, "data.json");
const BACKUP_FILE = path.join(PROJECT_ROOT, "data.json.bak");

// Queue for atomic writes to prevent race conditions
let writeQueue = Promise.resolve();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/data", async (req, res) => {
    try {
      if (!existsSync(DATA_FILE)) return res.json(null);
      const data = await fs.readFile(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/data", async (req, res) => {
    const newData = req.body;
    if (!newData || typeof newData !== 'object') return res.status(400).json({ error: "Invalid data format" });

    writeQueue = writeQueue.then(async () => {
      try {
        if (existsSync(DATA_FILE)) await fs.copyFile(DATA_FILE, BACKUP_FILE);
        const tempFile = `${DATA_FILE}.tmp`;
        await fs.writeFile(tempFile, JSON.stringify(newData, null, 2), "utf-8");
        await fs.rename(tempFile, DATA_FILE);
      } catch (error) {
        console.error("Error saving data:", error);
        throw error;
      }
    });

    try {
      await writeQueue;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  // INTEGRATION VITE (DÉVELOPPEMENT UNIQUEMENT)
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    // En production, server.js est dans dist/, donc distPath est __dirname
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
