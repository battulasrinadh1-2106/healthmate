import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { type Request, type Response } from "express";
import net from "net";
import path from "path";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./backend/config/db.ts";
import userRoutes from "./backend/routes/userRoutes.ts";

async function startServer() {
  const app = express();
  app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
  const PORT = 3000;

  // Body parser limit increase for reliability
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Database Connection gracefully
  await connectDB();

  // API routing - Dual-mounted for total endpoint compatibility with multiple fetch styles
  app.use("/api", userRoutes);
  app.use("/", userRoutes); // Direct root APIs also respond

  // Base API health indicators
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "HealthMate Backend Foundation with MongoDB",
    });
  });

  app.get("/api/info", (req: Request, res: Response) => {
    res.json({
      name: "HEALTHMATE MVP DB-FOUNDATION",
      version: "1.2.0",
      description: "Smart digital health companion platform backend database layer",
      features: [
        "Mongoose & MongoDB production schemas",
        "Dual API routing structure",
        "Safe in-memory database simulation redundancy",
        "Scalable BMIRecord tracking controller loggers"
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/debug/smtp-connect", (req: Request, res: Response) => {
    if (process.env.ENABLE_SMTP_DEBUG !== "true") {
      return res.status(404).json({ error: "Not found" });
    }

    const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10) || 587;
    const socket = net.createConnection({ host: smtpHost, port: smtpPort, timeout: 10000 }, () => {
      socket.end();
      res.json({ ok: true, host: smtpHost, port: smtpPort, note: "TCP connect succeeded to SMTP host" });
    });

    socket.on("error", (err) => {
      res.status(502).json({ ok: false, error: String(err) });
    });

    socket.on("timeout", () => {
      socket.destroy();
      res.status(504).json({ ok: false, error: "TCP connect timed out to SMTP host" });
    });
  });

  // Dedicated GET route for /reset-password to prevent production routing 404s
  app.get("/reset-password", async (req: Request, res: Response, next) => {
    if (process.env.NODE_ENV !== "production") {
      // In development, pass to downstream Vite middlewares
      return next();
    } else {
      // In production, directly serve the static SPA bundle
      const distPath = path.join(process.cwd(), "dist");
      return res.sendFile(path.join(distPath, "index.html"));
    }
  });

  // Vite middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Dynamic fallback for SPA routing in development so paths like /reset-password do not 404
    app.get("*", async (req: Request, res: Response, next) => {
      // Skip API requests and static assets
      if (req.originalUrl.startsWith("/api") || req.originalUrl.includes(".")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const fs = await import("fs");
        const template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // In production, serve the compiled assets in /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      if (req.originalUrl.startsWith("/api")) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 HealthMate Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Critical error starting Express backend server:", error);
});
