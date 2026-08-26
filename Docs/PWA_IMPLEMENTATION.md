# 📱 Progressive Web App (PWA) Implementation Guide

This document provides a complete, start-to-finish reference for the **Installable PWA** implemented in the **AlumnAI** client (`client/`) using the **official Next.js guide** ([nextjs.org/docs/app/guides/progressive-web-apps](https://nextjs.org/docs/app/guides/progressive-web-apps)) on **Next.js 16 (App Router, Turbopack)**.

**Scope of this implementation:** ✅ Installable to home screen (manifest + service worker + security headers). ❌ Web Push notifications and ❌ offline caching were intentionally excluded (see [Section 9](#9-scope-decisions--future-extensions)).

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Step 1 — Web App Manifest](#2-step-1--web-app-manifest-clientappmanifestts)
3. [Step 2 — Icon Assets Generation](#3-step-2--icon-assets-generation)
4. [Step 3 — Viewport & iOS Metadata (Root Layout)](#4-step-3--viewport--ios-metadata-root-layout)
5. [Step 4 — Minimal Service Worker](#5-step-4--minimal-service-worker-publicswjs)
6. [Step 5 — Service Worker Registration Component](#6-step-5--service-worker-registration-component)
7. [Step 6 — Security Headers](#7-step-6--security-headers-nextconfigmjs)
8. [Verification & Testing](#8-verification--testing)
9. [Scope Decisions & Future Extensions](#9-scope-decisions--future-extensions)
10. [Troubleshooting & Common Gotchas](#10-troubleshooting--common-gotchas)
11. [File Change Summary](#11-file-change-summary)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / DEVICE                        │
│                                                             │
│   1. Loads page ──► reads <link rel="manifest">             │
│   2. Fetches /manifest.webmanifest                          │
│      (name, icons, display, theme_color)                    │
│   3. Shows "Install App" prompt                             │
│                                                             │
│   RootLayout (Server)          RegisterSW (Client)          │
│   ├── <meta name=theme-color>  ├── useEffect() on mount     │
│   ├── <link rel=manifest>      └── navigator.serviceWorker  │
│   └── <link rel=apple-touch-       .register('/sw.js')      │
│        icon>                                │               │
└─────────────────────────────────────────────┼───────────────┘
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVICE WORKER  (public/sw.js)                 │
│                                                             │
│   install  ─► self.skipWaiting()                            │
│   activate ─► clients.claim()                               │
│   fetch    ─► passthrough to network (no caching by design) │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles
- **Manifest-driven installability**: A valid web app manifest + HTTPS are all modern browsers need to offer the install prompt.
- **Zero new dependencies**: Everything uses Next.js built-in metadata routes/conventions — no `next-pwa`, Serwist, or Workbox.
- **Stable SW URL**: The service worker is served from `public/sw.js` (un-hashed) so its dedicated cache/CSP headers always apply (see [Section 10](#10-troubleshooting--common-gotchas)).

---

## 2. Step 1 — Web App Manifest (`client/app/manifest.ts`)

Next.js App Router has a built-in metadata file convention: exporting a default function from `app/manifest.ts` automatically serves `/manifest.webmanifest` **and** injects `<link rel="manifest" href="/manifest.webmanifest">` into every page's `<head>`.

```typescript
// client/app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'AlumnAI',
        short_name: 'AlumnAI',
        description: 'AlumnAI is a platform for alumni to connect with each other and with their alma mater.',
        start_url: '/',
        display: 'standalone',
        background_color: '#1A216D',
        theme_color: '#1A216D',
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icons/maskable-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
    ],
  }
}
```

### Field Reference

| Field | Value | Purpose |
| :--- | :--- | :--- |
| `name` / `short_name` | `AlumnAI` | Full name (install banner, store listings) / short name (home screen label) |
| `start_url` | `/` | Page opened when the app is launched from the home screen |
| `display` | `standalone` | Launches without browser UI (address bar hidden) — feels native |
| `theme_color` | `#1A216D` (brand navy) | Colors the OS title bar / task switcher when installed |
| `background_color` | `#1A216D` | Splash screen background shown at cold start |
| `icons[].purpose: 'any'` | — | Icon rendered freely by the OS |
| `icons[].purpose: 'maskable'` | — | Icon cropped into circles/squircles/squares per platform (Android adaptive icons) |

> ⚠️ **Bug fixed during implementation**: the original manifest referenced `/logo/logoalumnai_200.png`, which never existed in `public/logo/`, and declared the full-size (~372 KB) logo as a `192x192` icon. Broken or wrongly-sized icons fail install criteria.

---

## 3. Step 2 — Icon Assets Generation

Per the official guide ("use favicon generators … place generated files in your `public/` folder"), four PNGs were produced from the existing brand logo `public/logo/logoalumnai.png` using a local GDI+/System.Drawing resize script instead of an external tool.

### Source Analysis
- Source logo is **1408 × 768** (wide rectangle, not square).
- Corners are fully transparent (`A=0`) → contain-fit onto square canvases works cleanly.

### Generated Files

| File | Size | Background | Logo Scale | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `public/icons/icon-192x192.png` | 192×192 | Transparent | 90% (contain-fit) | General / small contexts |
| `public/icons/icon-512x512.png` | 512×512 | Transparent | 90% (contain-fit) | Install dialogs, splash screens |
| `public/icons/maskable-512x512.png` | 512×512 | Solid `#1A216D` | 70% | Android adaptive masks (safe zone) |
| `app/apple-icon.png` | 180×180 | Solid `#1A216D` | 85% | iOS home screen (Apple Touch Icon) |

### Maskable Icon Safe Zone
Android crops maskable icons into shapes as aggressive as a circle whose diameter is **80%** of the icon. Content must fit inside that inner circle — hence the logo is scaled to 70% on a solid navy canvas so no part of the artwork gets cut off.

```
┌─────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ▓ = #1A216D background (gets cropped away)
│ ▓▓┌───────────┐▓▓ │
│ ▓▓│  logo @70% │▓▓ │  safe zone = inner circle ⌀80%
│ ▓▓└───────────┘▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────┘
```

### Apple Icon Convention
Placing `app/apple-icon.png` in the App Router triggers Next.js' image file convention: it is served at `/apple-icon.png` and Next.js **automatically emits** `<link rel="apple-touch-icon" ... sizes="180x180">`. No manual `<head>` edits needed.

---

## 4. Step 3 — Viewport & iOS Metadata (Root Layout)

`client/app/layout.tsx` was extended with two exports from Next.js' Metadata API:

```tsx
// client/app/layout.tsx
import type { Metadata, Viewport } from "next"
import { RegisterSW } from "@/components/pwa/register-sw"

export const metadata: Metadata = {
  // ...existing title/description...
  appleWebApp: {
    capable: true,
    title: "AlumnAI",
    statusBarStyle: "default",
  },
}

export const viewport: Viewport = {
  themeColor: "#1A216D",
}
```

Emitted `<head>` tags (verified against production build):

```html
<meta name="theme-color" content="#1A216D"/>
<meta name="mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-title" content="AlumnAI"/>
<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
<link rel="apple-touch-icon" href="/apple-icon.png?apple-icon.<hash>.png" sizes="180x180" type="image/png"/>
<link rel="manifest" href="/manifest.webmanifest"/>
```

> ℹ️ In Next.js 16, `themeColor` must live in the `viewport` export (putting it in `metadata` is deprecated).

---

## 5. Step 4 — Minimal Service Worker (`client/public/sw.js`)

A minimal lifecycle worker registers so the app satisfies classic PWA expectations, while doing **no caching** (offline support was out of scope):

```javascript
// client/public/sw.js
self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function () {
  // Passthrough: requests go directly to the network.
  // Offline caching is intentionally not implemented.
})
```

### Lifecycle Explained

| Event | Code | Meaning |
| :--- | :--- | :--- |
| `install` | `self.skipWaiting()` | New worker activates immediately instead of waiting for old workers/tabs to close |
| `activate` | `clients.claim()` | Takes control of already-open pages without requiring a reload |
| `fetch` | empty handler | Requests bypass the worker straight to the network — zero behavioral change |

---

## 6. Step 5 — Service Worker Registration Component

Following the guide's registration pattern (a client component registering on mount):

```tsx
// client/components/pwa/register-sw.tsx
'use client'

import { useEffect } from 'react'

export function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
    }
  }, [])

  return null
}
```

Mounted once in the root layout so every route gets the worker:

```tsx
// client/app/layout.tsx
<TooltipProvider>
  {children}
  <Toaster />
  <RegisterSW />
</TooltipProvider>
```

### Options Explained
- **`scope: '/'`** — the worker controls every route of the origin.
- **`updateViaCache: 'none'`** — the browser re-validates `/sw.js` against the server on navigation instead of trusting the HTTP cache, guaranteeing users receive worker updates promptly.
- **Feature detection** (`'serviceWorker' in navigator`) keeps SSR-safe behavior and gracefully skips unsupported browsers.

---

## 7. Step 6 — Security Headers (`client/next.config.mjs`)

Copied verbatim from the official guide's *Securing your application* section:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { /* ...unchanged... */ },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
  },
}
```

### Header Reference

| Header | Applied To | Why It Matters |
| :--- | :--- | :--- |
| `X-Content-Type-Options: nosniff` | All routes | Prevents MIME-type sniffing attacks |
| `X-Frame-Options: DENY` | All routes | Blocks clickjacking via iframes |
| `Referrer-Policy: strict-origin-when-cross-origin` | All routes | Limits referrer data leakage cross-origin |
| `Content-Type: application/javascript; charset=utf-8` | `/sw.js` | Ensures the worker is interpreted as JS |
| `Cache-Control: no-cache, no-store, must-revalidate` | `/sw.js` | Browser must re-fetch the worker — stale workers can pin old apps for weeks |
| `Content-Security-Policy: default-src 'self'; script-src 'self'` | `/sw.js` | Worker can only execute same-origin scripts |

---

## 8. Verification & Testing

All checks below were run after implementation.

### Build & Static Checks
```
npm run typecheck   ✓ clean
npm run lint        ✓ no new errors (pre-existing issues untouched)
npm run build       ✓ /manifest.webmanifest and /apple-icon.png appear as static routes
```

### Runtime Smoke Test (`npm run build && npm start`)
| Check | Result |
| :--- | :--- |
| `GET /sw.js` | `200` · correct `Content-Type`, `Cache-Control: no-cache…`, CSP header present |
| `GET /manifest.webmanifest` | `200` · JSON contains all three icons with correct `purpose` values |
| `GET /icons/*.png`, `/apple-icon.png`, `/favicon.ico` | `200 image/png` / `image/x-icon` |
| Homepage `<head>` | All tags from Section 4 present |

### Manual Testing Checklist
1. **Chrome Desktop**: open the deployed site → DevTools → **Application → Manifest** → confirm no errors → click **Install** (or the ⊕ icon in the address bar).
2. **Chrome Android**: menu → **Add to Home Screen**.
3. **iOS Safari**: Share sheet → **Add to Home Screen** (uses `apple-touch-icon` + `appleWebApp` meta tags).
4. **Service Worker**: DevTools → **Application → Service Workers** → confirm `sw.js` is *activated and running* with scope `/`.
5. Local HTTPS (needed for real device testing): `npm run dev -- --experimental-https`.

> 🔑 **Production requirement**: installability only triggers over **HTTPS** (or `localhost`). Ensure your deployment (e.g., behind nginx/Cloudflare) terminates TLS properly.

---

## 9. Scope Decisions & Future Extensions

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Installable PWA | ✅ Done | This document |
| Web Push Notifications | ❌ Deferred | Requires VAPID keys (`web-push generate-vapid-keys`), a subscribe/unsubscribe Server Action pair, subscription storage in PostgreSQL, and a `push` handler in the SW. The official guide's steps 2–5 cover it; our Express backend would host the subscription endpoints. |
| Offline Caching | ❌ Deferred | Next.js has no first-party solution; the guide recommends [Serwist](https://github.com/serwist/serwist) (has Turbopack examples). Would replace `public/sw.js` with a generated precache manifest. |
| Custom Install Button (`beforeinstallprompt`) | ❌ Skipped | Official guide explicitly recommends against it — not cross-browser (broken on Safari iOS). |

---

## 10. Troubleshooting & Common Gotchas

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| No install prompt in Chrome | Site not HTTPS, or manifest missing required icon sizes (192 + 512) | Verify TLS; check DevTools → Application → Manifest for errors |
| Old service worker stuck after deploy | Worker cached by HTTP cache | Already mitigated via `updateViaCache: 'none'` + `no-cache` header; hard-bump by editing `sw.js` content |
| Masked icon looks cropped on Android | Regular icon used for maskable slot | Keep the dedicated `maskable-512x512.png` entry with `purpose: 'maskable'` |
| Icons blurry/pixelated | Declaring size larger than actual pixels | Always match `sizes` to real dimensions (we regenerate from the master logo) |
| `theme-color` not applied | Set in `metadata` instead of `viewport` | Use `export const viewport: Viewport = { themeColor: ... }` |

### Documented Deviation from the Guide
The guide's example registers `new URL('../lib/service-worker.js', import.meta.url)` (bundler-emitted asset), yet its own security-header example targets `source: '/sw.js'`. We chose the **`public/sw.js`** variant because:
1. Stable, un-hashed URL → the documented `/sw.js` headers always apply.
2. Avoids bundler asset-path quirks across Turbopack dev/prod builds.
3. Same-origin either way; `scope: '/'` behaves identically.

---

## 11. File Change Summary

| File | Change |
| :--- | :--- |
| `client/public/icons/icon-192x192.png` | ➕ New — resized from logo |
| `client/public/icons/icon-512x512.png` | ➕ New — resized from logo |
| `client/public/icons/maskable-512x512.png` | ➕ New — navy bg, safe-zone scaled |
| `client/app/apple-icon.png` | ➕ New — Apple Touch Icon convention |
| `client/app/manifest.ts` | ✏️ Fixed broken icon refs; added `purpose`; colors → `#1A216D` |
| `client/app/layout.tsx` | ✏️ Added `Viewport` export, `appleWebApp` metadata, mounted `<RegisterSW />` |
| `client/public/sw.js` | ➕ New — minimal service worker |
| `client/components/pwa/register-sw.tsx` | ➕ New — client-side SW registration |
| `client/next.config.mjs` | ✏️ Added global + `/sw.js` security headers |

*No npm dependencies were added.*
