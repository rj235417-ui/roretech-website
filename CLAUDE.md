# RORE Tech — Website Context (roretech-website)

## What This Repo Is
Static marketing website for RORE Tech at roretech.com. Plain HTML/CSS only — no framework, no build step, no JavaScript dependencies. Hosted on Netlify, source on GitHub. Deploy by pushing to main; Netlify auto-deploys in ~60 seconds.

**GitHub:** https://github.com/rj235417-ui/roretech-website

---

## Folder Structure

```
roretech-website/
├── CLAUDE.md
├── index.html                  ← company hub / homepage
├── privacy.html                ← Security SPY privacy (root — Play Store links here)
├── security-spy/
│   ├── index.html              ← Security SPY product page
│   ├── terms.html
│   └── privacy.html
├── journal/
│   ├── index.html              ← RORE Edge Journal product page
│   ├── terms.html
│   └── privacy.html
├── vibespinner/
│   ├── index.html              ← Vibe Spinner product page
│   ├── terms.html
│   └── privacy.html
├── games/
│   └── vibespinner/            ← PWA (DO NOT TOUCH — live game)
├── security__spy_app_logo.png
├── RORE_Tech_Journal_app_Logo.png
├── Vibe_Spinner_app_Logo.png
├── RORE_Tech_transparent.png
├── RORE_Tech_dark.png
├── RORE_Tech_light.png
└── .gitignore                  ← excludes *.mp4, *.mov, node_modules, .DS_Store
```

---

## Design System — Never Change These

**Fonts:** Syne (headings, weight 800) + DM Sans (body, weight 300/400/500) via Google Fonts

**Colors:**
```css
--bg: #080B10          /* page background */
--surface: #111820     /* cards, panels */
--border: rgba(255,255,255,0.07)
--accent: #00C2FF      /* Security SPY / primary cyan */
--accent2: #0076FF
--fintech2: #22D3EE    /* RORE Edge Journal teal */
--vibe: #A855F7        /* Vibe Spinner purple */
--vibe2: #7C3AED
--text: #E8EDF3
--muted: #6B7A8D
```

**Per-product accent colors:**
- Security SPY → `#00C2FF` (cyan/blue)
- RORE Edge Journal → `#22D3EE` (teal)
- Vibe Spinner → `#A855F7` (purple)

**Background effects:** noise texture overlay (SVG data-uri) + CSS grid lines + radial orb blurs

**Dark theme only. Never add a light mode.**

---

## Nav & Footer Pattern — All Pages

**Nav:** Fixed, blurred background, text-only logo (NO image):
```html
<nav>
  <div class="container">
    <a href="/" class="nav-logo">RORE<span>.</span>TECH</a>
    <!-- homepage: nav-links with Security / Trading / Gaming / Contact -->
    <!-- product pages: single nav-back link -->
    <a href="/security-spy/" class="nav-back">← Back to Security SPY</a>
  </div>
</nav>
```

**Footer:** Text-only logo, copyright, 3 links max:
```html
<footer>
  <div class="container">
    <div class="footer-brand">
      <a href="/" class="footer-logo-text">RORE<span>.</span>TECH</a>
      <p class="footer-copy">© 2026 RORE Tech. All rights reserved.</p>
    </div>
    <div class="footer-links">
      <a href="/privacy.html">Privacy</a>
      <div class="fdiv"></div>
      <a href="mailto:support@roretech.com">Support</a>
      <div class="fdiv"></div>
      <a href="mailto:privacy@roretech.com">Privacy Contact</a>
    </div>
  </div>
</footer>
```

**Important:** No PNG logo images in nav or footer anywhere. Text only.

---

## Company — RORE Tech

**Tagline:** Your device. Your data. Your edge.
**Sub-tagline:** Trade smarter. Stay secure. Play harder.
**Philosophy:** Privacy-first, all data stays on device, no cloud, no accounts required
**Contact:** support@roretech.com / privacy@roretech.com
**Governing law:** State of Delaware, USA

---

## Products

### 1. Security SPY
- **Subtitle:** Smart Lens
- **Tagline:** Silent. Smart. Sentinel.
- **Platform:** Android (live) · iOS (coming soon)
- **Package:** com.rore.securityspy
- **What it does:** Silently photographs anyone who opens tagged apps on your phone. Owner face recognition skips capture for the real owner. Encrypted on-device vault. Zero cloud.
- **Pricing:**
  - Free: 1 tagged app, last 5 log entries, no vault, no face recognition
  - Trial (30 days): 2 apps (permanently assigned), full vault, face recognition — photos locked at trial end
  - Pro: $2.99/mo or $14.99/yr — unlimited apps, full vault always, full log, PDF export
- **Play Store URL:** https://play.google.com/store/apps/details?id=com.rore.securityspy
- **Legal pages:** `/security-spy/terms.html` · `/security-spy/privacy.html`
- **Root privacy:** `/privacy.html` stays at root (Play Store links here — do not move)

### 2. RORE Edge Journal
- **Subtitle:** Trade Journal · Desktop
- **Tagline:** Your trades. Your machine. Your edge.
- **Platform:** macOS + Windows (live)
- **What it does:** Desktop trade journal. Import from 8 brokers, full analytics, AI coaching via Claude API. 100% local — no cloud, no accounts.
- **Supported brokers:** Fidelity, Robinhood, Charles Schwab, TD Ameritrade, IBKR, Tastytrade, E*TRADE, Webull
- **Pricing:**
  - Free: 40 trades/month, Dashboard + Calendar only, resets 1st of month
  - Pro: $9.99/mo — unlimited trades, full analytics, AI coaching, Trade Log
  - Lifetime: $199 one-time — everything Pro forever, license key via Gumroad
- **Download URL:** https://github.com/rj235417-ui/rore-edge-journal/releases
- **Purchase URL:** https://roretech.com/upgrade (Gumroad)
- **AI feature:** Uses Claude API (Anthropic). Only transmits trade data when user explicitly requests AI review and consents. Never transmits PII.
- **Legal pages:** `/journal/terms.html` · `/journal/privacy.html`

### 3. Vibe Spinner
- **Full name:** Vibe Spinner (NOT "Vibe Studios Spinner" — this was corrected)
- **Subtitle:** High-RPM Engine Simulator
- **Tagline:** Rev it. Feel it. Max it.
- **Platform:** Android (coming soon) · iOS (coming soon)
- **PWA:** lives at `/games/vibespinner/` — DO NOT TOUCH, it is live
- **What it does:** Physics-accurate engine spinner with real-time audio synthesis, overheat effects at 125K RPM, screen shake, 4 engine skins.
- **Skins:** Lambo (free), Mustang (Pro), Harley (Pro), Jet (Pro)
- **Pricing (one-time, no subscriptions):**
  - Free: Lambo only, 50K RPM cap
  - Pro: $1.99 — all 4 skins, 150K RPM cap, overheat + shake effects, photo upload
  - MAX: $4.99 — everything Pro + unlimited RPM + Game Mode (planned)
- **Physical warning:** Game requires repetitive finger spinning. Must include physical strain warning on product page and in Terms.
- **Legal pages:** `/vibespinner/terms.html` · `/vibespinner/privacy.html`

---

## Deploy Process

```bash
git add -A
git commit -m "description"
git push
# Netlify auto-deploys to roretech.com in ~60 seconds
```

**Never commit:** `*.mp4`, `*.MP4`, `*.mov`, `*.MOV`, `node_modules`, `.DS_Store`

---

## Live URLs

| Page | URL |
|---|---|
| Homepage | roretech.com |
| Security SPY | roretech.com/security-spy/ |
| RORE Edge Journal | roretech.com/journal/ |
| Vibe Spinner | roretech.com/vibespinner/ |
| Security SPY Privacy (Play Store) | roretech.com/privacy.html |
| Journal Terms | roretech.com/journal/terms.html |
| Journal Privacy | roretech.com/journal/privacy.html |
| Vibe Spinner PWA (DO NOT TOUCH) | roretech.com/games/vibespinner/ |

---

## Key Rules — Always Follow

1. **Plain HTML/CSS only** — no React, no npm, no build tools
2. **No logo images in nav/footer** — text-only `RORE.TECH` in Syne font
3. **Dark theme only** — background always `#080B10`
4. **Per-product colors** — cyan for Security, teal for Journal, purple for Vibe
5. **Never touch** `/games/vibespinner/` — live PWA
6. **`/privacy.html` stays at root** — Play Store links to this URL
7. **Vibe Spinner** — never write "Vibe Studios Spinner"
8. **All data is local** — never imply cloud storage in any copy
9. **No financial advice** — Journal pages must maintain this disclaimer
10. **Physical warning** — Vibe Spinner terms/product page must keep RSI warning
