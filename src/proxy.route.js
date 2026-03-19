const { Router } = require("express");
const proxyController = require("./proxy.controller.js");

const proxyRouter = Router();

proxyRouter.options("*", proxyController.handleOptions);

// ─────────────────────────────────────────────────────────────────────────────
// 1.  /proxy/m3u8?url=<encoded>&referer=<encoded>
//     Fetch an M3U8 playlist, rewrite it, and return it.
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/m3u8", proxyController.handleRequest);

// ─────────────────────────────────────────────────────────────────────────────
// 2.  /proxy/segment?url=<encoded>&referer=<encoded>
//     Transparently pipe a TS / fMP4 / CMAF / AAC / MP4 segment.
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/segment", proxyController.handleSegment);

// ─────────────────────────────────────────────────────────────────────────────
// 3.  /proxy/key?url=<encoded>&referer=<encoded>
//     Proxy AES-128 / SAMPLE-AES decryption keys.
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/key", proxyController.handleKey);

// ─────────────────────────────────────────────────────────────────────────────
// 4.  /proxy/subtitle?url=<encoded>&referer=<encoded>
//     Proxy WebVTT / SRT subtitle files.
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/subtitle", proxyController.subtitle);

// ─────────────────────────────────────────────────────────────────────────────
// 5.  /proxy/audio?url=<encoded>&referer=<encoded>
//     Proxy audio-only renditions (AAC, MP3, Opus, etc.)
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/audio", proxyController.handleAudio);

// ─────────────────────────────────────────────────────────────────────────────
// 6.  /proxy/image?url=<encoded>&referer=<encoded>
//     Proxy thumbnail / trick-play images.
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/image", proxyController.handleImage);

// ─────────────────────────────────────────────────────────────────────────────
// 7.  /proxy/raw?url=<encoded>&referer=<encoded>
//     Generic catch-all: proxies anything without rewriting.
// ─────────────────────────────────────────────────────────────────────────────
proxyRouter.get("/raw", proxyController.rawRequest);

module.exports = proxyRouter;