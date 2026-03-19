# 🎬 M3U8 Proxy

A lightweight Node.js/Express proxy service for handling `.m3u8` streams and related resources (segments, keys, subtitles, audio, images).  
Some streams require a `Referer` header or special handling — this proxy makes it easier to integrate them into custom players.

## 🚀 Features
- Proxy `.m3u8` manifests with optional `referer` support
- Proxy video segments, keys, subtitles, audio, and images
- Generic raw proxy endpoint for other resources
- Simple test player at `/test`
- Clean startup logs with icons for quick reference


## 📦 Installation

```bash
git clone <your-repo-url>
cd m3u8-proxy
npm install
```

---

## ▶️ Usage

### Development Mode
Run with hot reload using **nodemon**:
```bash
npm run dev
```

### Production Mode
Run with Node.js:
```bash
npm start
```

---

## 🔗 Endpoints

| Endpoint   | Description | Example |
|------------|-------------|---------|
| `/test`    | Simple test player | `http://localhost:3000/test` |
| `/proxy/m3u8` | Proxy `.m3u8` manifest (supports referer) | `/proxy/m3u8?url=<encoded_m3u8_url>&referer=<encoded_referer_url>` |
| `/proxy/segment` | Proxy video segment | `/proxy/segment?url=<encoded_segment_url>` |
| `/proxy/key` | Proxy encryption key | `/proxy/key?url=<encoded_key_url>` |
| `/proxy/subtitle` | Proxy subtitle file | `/proxy/subtitle?url=<encoded_subtitle_url>` |
| `/proxy/audio` | Proxy audio stream | `/proxy/audio?url=<encoded_audio_url>` |
| `/proxy/image` | Proxy image/thumbnails | `/proxy/image?url=<encoded_image_url>` |
| `/proxy/raw` | Generic proxy for any resource | `/proxy/raw?url=<encoded_url>` |

---

## ⚙️ Notes
- Always **URL-encode** the resource URLs before passing them as query parameters.
- Some `.m3u8` streams require a `Referer` header — use the `referer` query parameter in `/proxy/m3u8`.
- This proxy is intended for development and testing purposes.