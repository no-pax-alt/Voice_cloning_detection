import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { buildDemoAnalysis, getAnalysis } from "./analysis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "2mb" }));

  // Stable API boundary for the frontend. The demo implementation can be
  // replaced by a real AASIST/FastAPI adapter without changing the UI contract.
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "voiceguard-api", version: "0.1.0" });
  });

  app.post("/api/analyze", (req, res) => {
    try {
      const result = buildDemoAnalysis(req.body ?? {});
      res.status(200).json(result);
    } catch {
      res.status(400).json({
        error: "INVALID_ANALYSIS_REQUEST",
        message: "Unable to process the analysis request.",
      });
    }
  });

  app.get("/api/analysis/:id", (req, res) => {
    const result = getAnalysis(req.params.id);
    if (!result) {
      res.status(404).json({ error: "ANALYSIS_NOT_FOUND" });
      return;
    }
    res.status(200).json(result);
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
