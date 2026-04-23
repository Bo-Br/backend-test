import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data.json");

// Ensure data file exists with initial empty object if not present
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

/**
 * Atomic Write implementation
 * Writes to a temporary file first, then renames it to the target file.
 * This prevents data corruption if the process crashes during a write.
 */
async function atomicWrite(filePath: string, data: any) {
  const tmpPath = `${filePath}.tmp`;
  await fs.promises.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tmpPath, filePath);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = await fs.promises.readFile(DATA_FILE, "utf8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/data", async (req, res) => {
    try {
      await atomicWrite(DATA_FILE, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Save error:", error);
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
