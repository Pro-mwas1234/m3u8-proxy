require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const ApiError = require("./ApiError");
const proxyRoutes = require("./proxy.route");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS || "*";
app.use(
  cors(
    allowedOrigins === "*"
      ? {}
      : {
          origin: allowedOrigins.split(",").map((o) => o.trim()),
          methods: ["GET", "HEAD", "OPTIONS"],
        }
  )
);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, slow down." },
  })
);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/proxy", proxyRoutes);

// Serve test page - FIXED for Vercel (looks in root, not src)
const staticPath = process.env.VERCEL
  ? path.join(process.cwd(), "test.html")
  : path.join(__dirname, "../test.html");
app.use("/test", express.static(staticPath));

const proxyEndpoint = (type, placeholder) => `/proxy/${type}?url=<${placeholder}>`;

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "m3u8-proxy",
    note: "Some m3u8 streams require a referer header",
    endpoints: {
      player: "/test",
      m3u8: `${proxyEndpoint("m3u8", "encoded_m3u8_url")}&referer=<encoded_referer_url>`,
      segment: proxyEndpoint("segment", "encoded_segment_url"),
      key: proxyEndpoint("key", "encoded_key_url"),
      subtitle: proxyEndpoint("subtitle", "encoded_subtitle_url"),
      audio: proxyEndpoint("audio", "encoded_audio_url"),
      image: proxyEndpoint("image", "encoded_image_url"),
      generic: proxyEndpoint("raw", "encoded_url"),
    },
  });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.log("An error", err);
  res.set("Access-Control-Allow-Origin", "*");

  if (err?.statusCode) {
    return res.status(err.statusCode || 500).json(err);
  }

  return res
    .status(err.statusCode || 500)
    .json(new ApiError(err.statusCode || 500, "An error occurred", err.message));
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use("*", function (_req, res) {
  return res.status(404).json(new ApiError(404, "Page not found"));
});

// ==================== START SERVER ====================
// Only start server if NOT running on Vercel (serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ M3U8 Proxy running on port ${PORT}`);
    console.log(`▶️  Play: http://localhost:${PORT}/test`);
    console.log(`📋 Manifest: http://localhost:${PORT}/proxy/m3u8?url=...`);
  });
}

// Export app for Vercel serverless functions
module.exports = app;
