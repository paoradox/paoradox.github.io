# paoradox.github.io — JP Ancheta Javier's Portfolio

[![Website](https://img.shields.io/badge/website-live-02aaff?style=for-the-badge&logo=githubpages)](https://paoradox.github.io/)
[![Built with](https://img.shields.io/badge/built_with-HTML%2FCSS%2FJS-02aaff?style=for-the-badge&logo=html5)](https://developer.mozilla.org/)

A terminal‑themed portfolio website showcasing multimedia and IT projects, designed with a developer‑friendly aesthetic and robust security.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Terminal Aesthetic** | Fira Code monospace, terminal prompts (`$`), blinking cursors, and a Matrix‑style greeting overlay |
| **Multimedia Projects** | Embedded Behance project gallery with pagination and hover glow effects |
| **Tech Projects** | GitHub repository browser with custom display names and pagination |
| **Tools Marquee** | Animated carousel of development & creative tools (HTML, CSS, Python, Adobe, AI, etc.) |
| **Dynamic Greeting** | Time‑based greeting with a shuffling Matrix‑style text effect |
| **Security Hardened** | CSP, HTTPS enforcement, X‑Frame‑Options, and Referrer‑Policy headers |
| **Responsive** | Optimised for desktop, tablet, and mobile devices |
| **Dark/Light Themes** | Supports Bootstrap's `data-bs-theme` switching |

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6) |
| **Frameworks** | Bootstrap 5 (local), Font Awesome 5 (local) |
| **Typography** | Fira Code (Google Fonts) |
| **Hosting** | GitHub Pages |
| **APIs** | Behance Embed API, GitHub Repo Data (static mapping) |
| **Security** | CSP meta tags, HTTPS enforcement, X‑Frame‑Options |

---

## 📂 Project Structure

```
paoradox.github.io/
├── index.html                     # Main entry point
├── assets/
│   ├── bootstrap/                 # Bootstrap CSS/JS (local)
│   ├── css/
│   │   ├── styles.min.css         # Core styles
│   │   ├── terminal.css           # Terminal prompt & cursor styles
│   │   ├── greetings.css          # Matrix greeting overlay
│   │   └── tools-marquee.css      # Tools carousel animation
│   ├── fonts/                     # Font Awesome (local)
│   ├── img/                       # Header images, favicon, OG preview
│   └── js/
│       ├── security.js            # CSP + HTTPS enforcement
│       ├── greetings.js           # Matrix‑style greeting overlay
│       ├── projects-multimedia.js # Behance gallery with glow effect
│       └── projects-it.js         # GitHub repo browser with custom names
├── old/                           # Earlier/unused versions of files
│   ├── index-backup.html
│   ├── index-no-pagination.html
│   ├── index-no-views.html
│   ├── projects-it - Copy.js
│   ├── projects-multimedia - Copy.js
│   └── ui-paoradox.bsdesign
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- (Optional) A local server for development

### Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/paoradox/paoradox.github.io.git
   cd paoradox.github.io
   ```

2. **Open with Live Server** (VS Code)
   - Right‑click `index.html` → "Open with Live Server"
   - Or use Python: `python -m http.server 8000`

3. **Visit** `http://localhost:8000`

> **Note:** Opening `index.html` directly (`file://`) will trigger CORS and CSP restrictions. Always use a local server for development.

---

## 🔒 Security Highlights

| Security Feature | Implementation |
|------------------|----------------|
| **Content Security Policy (CSP)** | Restricts scripts, styles, images, frames, and connections to trusted origins |
| **HTTPS Enforcement** | Redirects HTTP → HTTPS in production (non‑localhost) |
| **X‑Frame‑Options** | Prevents clickjacking (`DENY`) |
| **X‑Content‑Type‑Options** | Prevents MIME type sniffing (`nosniff`) |
| **Referrer‑Policy** | Restricts referrer information (`strict-origin-when-cross-origin`) |

---

## 🎨 Design Highlights

| Element | Detail |
|---------|--------|
| **Typography** | Fira Code monospace for a terminal feel |
| **Colour Palette** | `#02aaff` (terminal blue), `#1c3dca` (primary), `#131416` (dark background) |
| **Greeting Effect** | Matrix‑style shuffling text that cycles through time‑based greetings |
| **Hover Effects** | Glow and scale animations on project cards |
| **Tools Marquee** | Infinite scroll with pause‑on‑hover |

---

## 📦 Dependencies

| Dependency | Version | Source |
|------------|---------|--------|
| Bootstrap | 5.x | Local (pre‑minified) |
| Font Awesome | 5.12.0 | Local |
| Fira Code | Latest | Google Fonts |

All external assets are served over HTTPS.

---

## 🧪 Testing

| Test Type | Command / Method |
|-----------|------------------|
| **Local** | `python -m http.server 8000` then visit `http://localhost:8000` |
| **Linting** | Browser DevTools → Console |
| **Security** | Check CSP violations in DevTools → Console |
| **Responsive** | DevTools → Device Toolbar |

---

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 🌐 Live Site

Visit the live portfolio: [paoradox.github.io](https://paoradox.github.io/)

---

## 🙏 Acknowledgements

- [Bootstrap](https://getbootstrap.com/) for responsive layout
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for Fira Code
- [Behance](https://www.behance.net/) for project embeds
- [GitHub](https://github.com/) for hosting

---

**Crafted by JP A. Javier** · Made with ❤️ in the Philippines
