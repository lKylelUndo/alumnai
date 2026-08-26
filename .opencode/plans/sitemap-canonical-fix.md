# Fix: Google Search Console Sitemap Issues (Duplicate without user-selected canonical)

## Diagnosis

1. **Double-slash URLs** — production env sets `NEXT_PUBLIC_BASE_URL=https://www.alumnaicpc.online/` (trailing slash); `app/sitemap.ts` naively concatenates `${BASE_URL}/login` → `https://www.alumnaicpc.online//login`. Google deems these duplicates of the clean URLs → "Duplicate without user-selected canonical".
2. **Dead routes advertised**: `/signup` (doesn't exist; only `/register`) and bare `/reset-password` (only `reset-password/[token]`) → 404s / "Discovered - currently not indexed".
3. **No canonical tags emitted anywhere**; UTM-variant homepage (`/?utm_medium=Scamadviser.com...`) relies on Google's self-selected canonical.

## Implementation Steps

### 1. NEW `client/lib/site.ts`
Normalized base URL constant (strips trailing slashes):
```ts
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://alumnai.example.com"
).replace(/\/+$/, "")
```

### 2. REWRITE `client/app/sitemap.ts`
- Import `SITE_URL` from `@/lib/site`
- Keep only real public routes: `/` (weekly, 1), `/login` (monthly, 0.8), `/register` (monthly, 0.8), `/forgot-password` (monthly, 0.6)
- REMOVE: `/signup`, bare `/reset-password`

### 3. EDIT `client/app/robots.ts`
- Replace local BASE_URL const with imported `SITE_URL`; sitemap pointer becomes `${SITE_URL}/sitemap.xml`

### 4. EDIT `client/app/layout.tsx`
- Add to metadata: `metadataBase: new URL(SITE_URL)` (official docs pattern; also slash-normalizes composed metadata URLs)

### 5. EDIT per-page self-canonicals (NOT root layout — children inherit and would claim `/`)
Add `alternates: { canonical: "/route" }` to existing metadata exports:
- `client/app/page.tsx` → canonical `"/"`
- `client/app/(auth)/login/page.tsx` → `"/login"`
- `client/app/(auth)/register/page.tsx` → `"/register"`
- `client/app/(auth)/forgot-password/page.tsx` → `"/forgot-password"`

### 6. Verify
- `npm run typecheck`, `npm run lint`, `npm run build`
- Smoke test prod server: `/sitemap.xml` shows single-slash URLs only; `/robots.txt` correct; pages emit `<link rel="canonical">`

## Manual follow-ups (outside codebase)
- Hosting env: set `NEXT_PUBLIC_BASE_URL=https://www.alumnaicpc.online` (NO trailing slash)
- Confirm apex ↔ www redirect consistency at host/DNS level
- GSC: resubmit sitemap, request re-indexing of key pages; old `//` URLs decay over weeks
