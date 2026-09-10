import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { buildAnalysis, getAnalysis } from "./analysis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // JSON is used at the ML boundary so the frontend can stay dependency-light.
  // Keep uploads bounded; production deployments should enforce a stricter limit.
  app.use(express.json({ limit: "12mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "voiceguard-api",
      version: "0.2.0",
      inferenceConfigured: Boolean(process.env.VOICE_ANALYSIS_API_URL?.trim()),
    });
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const result = await buildAnalysis(req.body ?? {});
      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to process the analysis request.";
      res.status(502).json({
        error: "INFERENCE_SERVICE_UNAVAILABLE",
        message,
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

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
