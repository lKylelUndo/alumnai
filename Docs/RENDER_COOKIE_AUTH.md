# Cookie Auth on Render: Subdomain vs First-Party Proxy

How login sessions break when the Next.js frontend and the Express backend live on
different hosts (e.g. frontend on `alumnaicpc.online`, backend on `*.onrender.com`),
why everything works on `localhost`, and the two ways to fix it on Render.

---

## 1. The problem we hit

Live symptoms, all on production only:

- Tab badges (pending counts) visible on `localhost`, missing on the live site —
  even though the tables below them show the rows.
- Student login needs a manual refresh before the session is recognized.
- Incognito login bounces straight back to the login page.
- Everything else works: tables populate, actions succeed.

Common thread: **every Server Component data fetch resolves empty in production**,
while client-side fetches succeed. The app only survives live because of the
client-side fallback fetches.

---

## 2. Root cause

```
BROWSER COOKIE JAR
 ├── accessToken  (host: <backend-host>, httpOnly, SameSite=None, Secure)
 └── refreshToken (host: <backend-host>, httpOnly, SameSite=None, Secure)

Request to FRONTEND (alumnaicpc.online)
 └── browser sends: frontend cookies only  ──►  backend cookies NOT sent

Next.js server (axiosServerInstance, client/lib/axios.ts)
 ├── cookies().get("accessToken")  ──►  undefined
 ├── no Authorization header attached
 └── backend answers 401 ──► refresh attempt fails the same way
      ──► Promise.allSettled marks it rejected ──► UI renders empty
```

Three facts combine into the failure:

1. Auth cookies are `httpOnly` and host-bound to the **backend** host. The browser
   only ever sends them to the backend — never to the frontend Next.js server.
2. The SSR data layer (`axiosServerInstance`) authenticates by reading that cookie
   via `next/headers` and forwarding it as `Authorization: Bearer`. With nothing
   to forward, every SSR request 401s. `auth-middleware.ts` then finds no Bearer
   header and no `req.cookies.accessToken` (server-to-server call carries no
   Cookie header), so it correctly rejects.
3. `localhost` hides all of this because `localhost:3000` and `localhost:8000`
   share the hostname `localhost` — **cookie scope ignores ports** — so the dev
   server receives the cookie and everything works. Incognito makes it worse by
   blocking third-party cookies outright (partially mitigated by
   `partitioned: true` / CHIPS for client flows, but SSR stays blind).

Net: **server-side authenticated fetching cannot work in production as long as
the frontend and backend are on unrelated hosts and auth lives in httpOnly
cookies.** No environment variable fixes this — it is structural, not config.

---

## 3. Option A — shared parent domain (subdomain cookies)

Works **only if** the backend lives on a subdomain of the frontend domain,
e.g. frontend `alumnaicpc.online` + backend `api.alumnaicpc.online`.

### How it works

Set `Domain=.alumnaicpc.online` on the auth cookies. The browser then treats both
hosts as same-site and sends the cookies to **both**. `next/headers` on the
Next.js server sees `accessToken`, the existing Bearer-forwarding interceptor
works unchanged, and third-party-cookie blocking no longer applies (same-site
is not cross-site, so CHIPS becomes unnecessary).

### Changes

- `server/src/controllers/auth.controller.ts` — `getCookieOptions()`: add
  `domain: ".alumnaicpc.online"`, keep `secure: true`, relax `sameSite` to
  `"lax"`, drop `partitioned`.
- Render: add the custom domain (`api.alumnaicpc.online`) to the backend
  service, point a DNS CNAME at it.
- Redeploy backend only. No client changes. No forced logout (old host-only
  cookies coexist until expiry; new logins overwrite by name).

### Trade-offs

| Pros | Cons |
|---|---|
| ~3 lines of code | Impossible with an `onrender.com` backend |
| No client changes, no re-login | Requires a custom domain + DNS on the backend |
| Keeps direct browser→backend calls (no proxy latency) | |

---

## 4. Option B — first-party proxy via Next.js rewrites

Works with **any** backend host, including `*.onrender.com`. This is the correct
choice for the current deployment.

### How it works

The browser talks **only** to the frontend host. Next.js rewrites forward
`/api/:path*` to the backend server-side. Because the browser now sees a single
origin:

- `Set-Cookie` responses bind to the **frontend** host (host-only by default) —
  cookies become first-party.
- First-party cookies are visible to `next/headers` (SSR works) and sent
  automatically by the browser (client works, incognito works).
- CORS stops mattering for API calls (same-origin).

```
BROWSER  ──►  FRONTEND (alumnaicpc.online/api/…)  ──►  BACKEND (private net)
   │                        │                                │
   │   cookies bound to     │   rewrites + forwards          │  sees Cookie
   │   frontend host ───────┘   Cookie header ──────────────►│  header natively
```

### Changes

- `client/next.config.mjs` — `rewrites()`: `/api/:path*` → `${BACKEND_URL}/api/:path*`
  (`BACKEND_URL` is server-only env, e.g. Render's internal backend address).
- `client/lib/axios.ts` — client instance baseURL becomes relative `/api`;
  server instance targets `BACKEND_URL` and forwards the incoming `Cookie`
  header from `next/headers` (first-party cookies are visible now).
- `auth.controller.ts` cookie options — `sameSite: "lax"`, drop `partitioned`
  (unneeded same-origin).
- Render — set `BACKEND_URL` (internal address) on the **frontend** service;
  `NEXT_PUBLIC_BACKEND_URL` stays for the Socket.IO client, which keeps its
  direct connection (sockets are not covered by HTTP rewrites — out of scope).
- Redeploy frontend (backend cookie change needs a backend redeploy too).

### Trade-offs

| Pros | Cons |
|---|---|
| Works with any backend host | **One forced re-login for all users** (old backend-domain cookies won't send to the frontend domain) |
| Fixes SSR data, badges, refresh-login, incognito in one move | Extra proxy hop latency (mitigated by Render private network) |
| No DNS or custom-domain work | A proxy misconfiguration fails **all** API calls — roll out via preview deploy first |

---

## 5. Side-by-side

|  | A: subdomain cookies | B: first-party proxy |
|---|---|---|
| Backend host requirement | Same parent domain (`api.` subdomain) | Any, incl. `onrender.com` ✅ (current setup) |
| Code changes | ~3 lines (cookie options) | `next.config.mjs` + `axios.ts` + cookie options |
| Render changes | Custom domain + DNS on backend | `BACKEND_URL` env on frontend |
| User impact | None | One forced re-login |
| Fixes SSR + badges + refresh + incognito | Yes | Yes |
| Rollout risk | Low | High if untested — use a preview deploy |

## 6. Recommendation

With the backend on `onrender.com`: **Option B**. If the backend ever moves to
`api.alumnaicpc.online`, Option A becomes the simpler choice and the proxy can
be removed.

## 7. Verification checklist (either option)

- [ ] Admin "Alumni Request" / "Verify Students" pills match table row counts
- [ ] Student + alumni request-tab pills appear live
- [ ] Student login lands with no manual refresh
- [ ] Incognito login reaches the dashboard
- [ ] Tables and badge counts agree with each other
- [ ] (Option B only) existing users re-login once without errors
