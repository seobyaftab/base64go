# base64go.com — Free Online Base64 Encoder & Decoder

Live, instant, 100% private Base64 encoding and decoding. Everything runs in your browser — no data is ever sent to a server.

## Features

- **Live Encode/Decode** — updates as you type, no buttons needed
- **Dual Mode** — encode and decode on one page with a single click
- **Smart Detection** — auto-detects Base64, Base64URL, and plain text
- **Drag & Drop** — drop any file to encode it instantly
- **Base64URL Support** — URL-safe variant for JWTs and API debugging
- **Error Messages** — shows exact position of invalid characters
- **Copy + Download** — one-click copy with animation, download as file
- **History** — last 20 operations saved locally
- **Dark Mode** — beautiful light and dark themes
- **Keyboard Shortcuts** — Ctrl+Enter to process, Ctrl+K to clear
- **Mobile First** — fully responsive, big touch targets
- **PWA** — works offline, installable

## Tech Stack

- **Astro 7** — static site generation
- **Tailwind CSS v4** — utility-first styling
- **Vercel Design System** — polished, professional UI
- **Zero dependencies** for the encode/decode engine — pure browser APIs

## Project Structure

```
src/
├── pages/
│   ├── index.astro          # Main tool — encode & decode
│   ├── what-is-base64.astro  # Educational guide (SEO)
│   └── privacy.astro         # Privacy policy
├── components/
│   ├── Nav.astro             # Navigation bar
│   └── Footer.astro          # Footer
├── layouts/
│   └── Layout.astro          # Base layout
├── lib/
│   └── base64.ts             # Encode/decode/detect engine
└── styles/
    └── global.css            # Tailwind + Vercel design tokens
```

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to ./dist/ |
| `npm run preview` | Preview production build |
| `npx playwright test` | Run 24 automated tests |

## Privacy

No tracking, no ads, no server processing. Your data stays on your device. [Read our privacy policy](https://base64go.com/privacy/).

## License

MIT
