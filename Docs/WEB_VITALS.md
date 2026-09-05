# Web Vitals & Performance Guide — AlumnAI

This document covers everything needed to maintain 90+ Lighthouse scores and fast rendering in this Next.js 16 application.

---

## Table of Contents

1. [Core Web Vitals Targets](#core-web-vitals-targets)
2. [Rendering Architecture](#rendering-architecture)
3. [Image Optimization](#image-optimization)
4. [Font Optimization](#font-optimization)
5. [Caching Strategy](#caching-strategy)
6. [Loading & Error States](#loading--error-states)
7. [Bundle Optimization](#bundle-optimization)
8. [Monitoring](#monitoring)
9. [Pre-Launch Checklist](#pre-launch-checklist)
10. [Common Pitfalls](#common-pitfalls)

---

## Core Web Vitals Targets

Google uses **CrUX field data (75th percentile)** for ranking — not Lighthouse lab scores. A 100 Lighthouse can still fail field INP on mid-range Android.

| Metric | Good | Needs Improvement | Poor | Weight |
|--------|------|-------------------|------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5–4.0s | > 4.0s | Heaviest |
| **INP** (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms | Replaced FID (Mar 2024) |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 | Medium |
| **FCP** (First Contentful Paint) | < 1.8s | 1.8–3.0s | > 3.0s | Medium |
| **TTFB** (Time to First Byte) | < 800ms | 800–1800ms | > 1800ms | Gatekeeper |

---

## Rendering Architecture

### Server Components by Default

**Rule:** Keep `layout.tsx` and `page.tsx` as Server Components. Only add `"use client"` to the smallest interactive leaf component.

**Why:** Server Components render to RSC Payload on the server, stream HTML, and send **0 JavaScript** to the client. Every `"use client"` adds hydration cost (attaching event handlers) — the #1 INP killer.

**Current state:** Our `app/` pages/layouts have no direct `"use client"`. However, the root layout wraps everything in `AuthProvider` → `SocketProvider` → `TooltipProvider` (all client), which makes the tree effectively client-rendered. This is acceptable because auth/socket are needed everywhere, but we minimize the blast radius.

**Pattern to follow:**
```tsx
// app/dashboard/page.tsx — KEEP SERVER
export default async function DashboardPage() {
  const data = await fetchData() // runs on server
  return <Dashboard data={data} /> // passes to client child
}

// app/dashboard/Dashboard.tsx — ONLY THIS IS CLIENT
"use client"
export function Dashboard({ data }) {
  const [filter, setFilter] = useState()
  return <div>{/* interactive UI */}</div>
}
```

**Audit command:** `grep -r '"use client"' app/` — should return zero results.

### Caching & Rendering Strategy

**Hierarchy:** `SSG/ISR` >> `PPR` >> `SSR`

| Strategy | When to Use | TTFB Impact |
|----------|-------------|-------------|
| **Static (SSG)** | Pages that never change (landing, about) | ~50ms (CDN edge) |
| **ISR** (`revalidate = N`) | Pages with data that changes periodically (dashboards, profiles) | ~100ms (stale cache + revalidate) |
| **PPR** (`Suspense` boundaries) | Pages with mix of static + dynamic content | ~150ms (static shell + dynamic islands) |
| **SSR** (dynamic) | Pages that must be fresh every request | ~500ms+ (server compute) |

**Next.js 16 note:** Nothing is cached by default. You must explicitly add `export const revalidate = N` or `'use cache'`.

### Parallelize Data Fetches

**Rule:** Never do sequential `await` for independent data.

```tsx
// BAD: sequential 3×200ms = 600ms
const posts = await fetchPosts()
const categories = await fetchCategories()

// GOOD: parallel 200ms
const [posts, categories] = await Promise.all([
  fetchPosts(),
  fetchCategories()
])
```

### Streaming with Suspense

**Rule:** Wrap every slow fetch in `<Suspense fallback={<Skeleton/>}>` with matching dimensions.

```tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <HeroBanner /> {/* LCP renders immediately */}
      <Suspense fallback={<ContentSkeleton />}>
        <DynamicContent />
      </Suspense>
    </div>
  )
}
```

---

## Image Optimization

### next/image Rules

1. **Always use `next/image`** — never raw `<img>` tags
2. **Above-the-fold LCP images:** Add `priority` + accurate `sizes` + `fetchPriority="high"`
3. **Below-the-fold:** Rely on default lazy loading (no `priority`)
4. **Every image needs `width`/`height`** OR `fill` + parent with `position: relative` + `aspect-ratio`
5. **Static imports** auto-detect dimensions — prefer when possible

```tsx
// LCP hero image — eager, preloaded
<Image
  src="/images/portalv2.png"
  width={420}
  height={420}
  priority
  fetchPriority="high"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Platform preview"
/>

// Below fold — lazy by default
<Image src="/images/feature.png" width={600} height={400} alt="Feature" />
```

### Image Configuration (`next.config.mjs`)

```js
images: {
  formats: ['image/avif', 'image/webp'],    // AVIF 30-50% smaller than WebP
  minimumCacheTTL: 60 * 60 * 24 * 30,      // 30 days cache
  remotePatterns: [...],                     // exact patterns, not deprecated domains
}
```

### Image File Guidelines

| Format | When | Size Impact |
|--------|------|-------------|
| **AVIF** | Hero images, photos | Best compression (50-70% smaller than PNG) |
| **WebP** | All web images | Good compression (25-35% smaller than JPEG) |
| **PNG** | Only for transparency needed | Largest — avoid for photos |
| **SVG** | Icons, logos, illustrations | Smallest for vector art |

**Current large files to optimize:**
- `logoalumnai.png` (363KB) → Consider SVG or WebP
- `portalv2.png` (240KB) → Convert to AVIF/WebP

---

## Font Optimization

### Use `next/font` (Already Implemented)

```tsx
import { Roboto } from "next/font/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export default function Layout({ children }) {
  return <html className={roboto.className}>{children}</html>
}
```

**Why `next/font`:**
- Self-hosts fonts at build time (no external network request)
- Emits `size-adjust` fallback metrics for invisible FOUT swap
- Automatically optimizes font loading

**Rules:**
- Limit to 2 font families max (each adds ~100-200KB)
- Use variable fonts when possible (single file, all weights)
- Never use `<link href="https://fonts.googleapis.com">` directly

---

## Caching Strategy

### Static Assets (Images, Logos, Fonts)

```js
// next.config.mjs headers
{
  source: '/images/(.*)',
  headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
}
```

**`immutable`** tells the browser: "This will never change at this URL. Don't revalidate." Safe for Next.js images because they get content-hashed filenames.

### API Routes & Data

| Strategy | Cache-Control | Use Case |
|----------|---------------|----------|
| **Static** | `s-maxage=31536000, stale-while-revalidate` | Landing page data |
| **ISR** | `s-maxage=3600, stale-while-revalidate` | Dashboard data |
| **Dynamic** | `no-store` | Real-time data (chat, notifications) |

### Service Worker (`sw.js`)

Our PWA service worker has `no-cache, no-store, must-revalidate` — correct for security-sensitive SW updates.

---

## Loading & Error States

### `loading.tsx` — Streaming Suspense Boundaries

**Created for:** `(auth)`, `student`, `alumni`, `admin` route groups.

**Purpose:** Shows a skeleton UI immediately while the page's async data loads. Prevents blank white screen during TTFB.

**Rule:** Every `loading.tsx` skeleton must match the **exact dimensions** of the final content to prevent CLS.

```
app/
├── (auth)/loading.tsx          # Auth page skeleton
├── student/loading.tsx         # Student dashboard skeleton
├── alumni/loading.tsx          # Alumni dashboard skeleton
└── admin/loading.tsx           # Admin dashboard skeleton
```

### `error.tsx` — Error Boundaries

**Created for:** `app/global-error.tsx`, `(auth)/error.tsx`, `student/error.tsx`, `alumni/error.tsx`, `admin/error.tsx`.

**Purpose:** Catches rendering errors and shows a recovery UI instead of a white screen.

**Rule:** Error boundaries must be `"use client"` components (they use `reset()` callback).

---

## Bundle Optimization

### Bundle Analyzer

```bash
# Run with analysis
ANALYZE=true npm run build
```

This opens an interactive treemap showing every byte in your bundle. Look for:
- Large dependencies (>50KB gzipped)
- Duplicate packages
- Barrel file imports (`import { x } from '@/lib'` pulling everything)

### Code Splitting with `next/dynamic`

**Rule:** Dynamic-import any client component >30KB not needed on first paint.

```tsx
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./Chart'), {
  ssr: false,  // for window/document dependencies
  loading: () => <ChartSkeleton />
})
```

**Candidates in this codebase:**
- `recharts` (Charts component) — heavy, rarely needed on initial load
- `ChatBox` — real-time messaging, not needed until user clicks
- `DataTable` / `CardDataTable` — TanStack Table, only on specific pages

### Third-Party Scripts

```tsx
import Script from 'next/script'

// Analytics — load after page is interactive
<Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />

// Or in a web worker (Partytown)
<Script strategy="worker">{`/* heavy script */`}</Script>
```

**Never use:** Sync `<script>` in `<head>` — blocks rendering.

### Tree-Shaking Friendly Imports

```tsx
// BAD — pulls entire library
import _ from 'lodash'
import moment from 'moment'

// GOOD — named imports, tree-shakeable
import groupBy from 'lodash/groupBy'
import { format } from 'date-fns'
```

---

## Monitoring

### Web Vitals Tracking

The `WebVitals` component (`components/common/WebVitals.tsx`) is mounted in the root layout and reports all Core Web Vitals metrics.

**Development:** Metrics log to console.
**Production:** Metrics POST to `/api/web-vitals` via `sendBeacon` (non-blocking).

### Adding an Analytics Endpoint

Create `app/api/web-vitals/route.ts` to receive metrics:

```ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Send to your analytics service:
  // - Vercel Analytics (automatic with `@vercel/analytics`)
  // - Google Analytics (gtag)
  // - Custom database

  console.log('[Web Vitals]', body.name, body.value)

  return NextResponse.json({ ok: true })
}
```

### Running Lighthouse

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run against local dev server
lighthouse http://localhost:3000 --view

# Or use PageSpeed Insights for field data
# https://pagespeed.web.dev/
```

### Target Budgets

| Metric | Warning | Error (block PR) |
|--------|---------|------------------|
| LCP | > 2.0s | > 2.5s |
| CLS | > 0.05 | > 0.1 |
| INP | > 150ms | > 200ms |
| TTFB | > 600ms | > 800ms |
| First Load JS/route | > 200KB | > 300KB |

---

## Pre-Launch Checklist

```
[ ] All app/ pages/layouts are Server Components (no "use client" in page.tsx)
[ ] Hero LCP image has priority + sizes + AVIF/WebP format
[ ] Every <Image> has width/height or fill + parent relative + aspect-ratio
[ ] Fonts via next/font (display: swap), ≤2 families
[ ] Each route has explicit revalidate or is truly dynamic
[ ] Suspense boundaries around slow data fetches, Promise.all for parallel
[ ] Heavy client components (>30KB) use next/dynamic
[ ] Third-party scripts use <Script strategy="lazyOnload|worker">
[ ] loading.tsx exists for every route group
[ ] error.tsx exists for every route group
[ ] Bundle analyzer run, no large unexpected imports
[ ] Static assets have immutable cache headers
[ ] Web Vitals monitoring installed and reporting
[ ] Test on PageSpeed Insights mobile — not just desktop Lighthouse
[ ] CLS: scrollbar-gutter: stable, animations on transform/opacity only
```

---

## Common Pitfalls

### 1. Forgetting `sizes` on `next/image`

**Problem:** Without `sizes`, Next.js defaults to `100vw` — mobile downloads desktop-sized images.

**Fix:** Always add `sizes` that match your CSS layout:
```tsx
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
```

### 2. Adding `priority` to Everything

**Problem:** If everything is "priority," nothing is. The browser can only preload ~6 resources.

**Fix:** Only the 1-2 largest above-the-fold images get `priority`.

### 3. Client Components at Layout Level

**Problem:** A `"use client"` in `layout.tsx` makes the entire route tree client-rendered.

**Fix:** Keep layouts as Server Components. Pass client state via `children` slot pattern.

### 4. Missing `width`/`height` on Images

**Problem:** Browser reserves 0px, shifts content when image loads = high CLS.

**Fix:** Always provide dimensions or use `fill` with a sized container.

### 5. Sequential Data Fetches

**Problem:** `await a(); await b();` = 2× latency instead of 1×.

**Fix:** `await Promise.all([a(), b()])` for independent fetches.

### 6. Not Using `loading.tsx`

**Problem:** Page shows blank white screen during server render.

**Fix:** Every route group should have a `loading.tsx` with skeleton matching final layout dimensions.

### 7. Heavy Client Components Without Dynamic Import

**Problem:** Charts, editors, rich text = huge JS parsed on main thread = bad INP.

**Fix:** `const Chart = dynamic(() => import('./Chart'), { ssr: false })`

### 8. Do NOT Remove `forceMount` From Dashboard Tabs

**Problem:** All 12 `TabsContent` panels across `StudentDashboard.tsx`, `AlumniDashboard.tsx`, and `AdminDashboard.tsx` use `forceMount`, so every tab mounts on page load. This looks like a wasted-mount optimization opportunity — it is not.

**Why it must stay:** the realtime notification system depends on mounted listeners. Each tab component subscribes via `useAdminSocket` / `useStudentSocket` / `useAlumniSocket` (`socket.on("admin:refresh" | "student:refresh" | "alumni:refresh")`, see `hooks/useAdminSocket.ts:31-35`) with `socket.off` cleanup on unmount. The handlers both refetch data AND fire visible toasts (e.g. `AlumniRequest.tsx:142-143`, `Mentors.tsx:22`). Removing `forceMount` unmounts inactive tabs, which detaches their listeners, causing:
1. **Missed toast notifications** — events firing while a tab is inactive are silently lost.
2. **Stale data with no recovery** — tabs without a mount-refetch (e.g. `Mentors.tsx`, props + socket only) show stale lists when revisited until the next event or full reload.

The socket connection itself (`SocketContext`, root layout) is unaffected — only the tab-scoped listeners break. `ChatBox` (`chat:new_message`, layout-level) is also unaffected.

**If tab mount ever measures slow**, the correct fix is lifting listeners to a persistent per-dashboard component outside `TabsContent` (one always-mounted `DashboardRealtimeListener` owning all subscriptions + toasts), NOT removing `forceMount`. That requires a mount-refetch audit on all 12 panels — only do it with profiler evidence.

---

## Quick Reference Commands

```bash
# Bundle analysis
ANALYZE=true npm run build

# Lighthouse audit
lighthouse http://localhost:3000 --view

# Find all "use client" in app/
grep -r '"use client"' app/

# Check bundle sizes
npx next build && cat .next/build-manifest.json

# Test on mobile (Chrome DevTools)
# F12 → Toggle device toolbar → Select "Moto G Power" or similar
```

---

*Last updated: September 2026*
*Next.js version: 16.1.7*
