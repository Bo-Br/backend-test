import express from "express";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data.json");
const BACKUP_FILE = path.join(__dirname, "data.json.bak");

// Queue for atomic writes to prevent race conditions
let writeQueue = Promise.resolve();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/data", async (req, res) => {
    try {
      if (!existsSync(DATA_FILE)) {
        return res.json(null); // Client will use defaults
      }
      const data = await fs.readFile(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading data:", error);
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/data", async (req, res) => {
    const newData = req.body;
    
    // Basic validation
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Atomic write logic via queue
    writeQueue = writeQueue.then(async () => {
      try {
        // Create backup if exists
        if (existsSync(DATA_FILE)) {
          await fs.copyFile(DATA_FILE, BACKUP_FILE);
        }

        const tempFile = `${DATA_FILE}.tmp`;
        await fs.writeFile(tempFile, JSON.stringify(newData, null, 2), "utf-8");
        await fs.rename(tempFile, DATA_FILE);
        
        console.log("Data saved successfully");
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

  // Use Vite as middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
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
