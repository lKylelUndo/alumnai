# 📚 AlumnAI Platform Documentation

Welcome to the official developer documentation for the **AlumnAI** platform.

---

## 📑 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Repository Directory Structure](#repository-directory-structure)
4. [Authentication & Security Flow](#authentication--security-flow)
5. [Caching Strategy (Redis)](#caching-strategy-redis)
6. [Real-Time WebSocket Architecture (Socket.IO)](#real-time-websocket-architecture-socketio)
7. [Progressive Web App (PWA)](#progressive-web-app-pwa)
8. [API Route Modules](#api-route-modules)
9. [Environment Variables Reference](#environment-variables-reference)
10. [VPS Deployment (Hostinger)](#vps-deployment-hostinger)
11. [Cookie Auth on Render: Subdomain vs Proxy](./RENDER_COOKIE_AUTH.md)

---

## 🏛 System Architecture Overview

AlumnAI is a full-stack platform connecting students and alumni with real-time mentorship, collaboration matchmaking, profile verification, and admin management.

```
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS CLIENT (App Router)               │
│                                                             │
│   AuthContext ───► SocketProvider ───► useAdminSocket       │
│                           │ (withCredentials: true)         │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP & WebSocket Handshake
                            ▼ (Sends httpOnly accessToken Cookie)
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND                        │
│                                                             │
│   - Middleware: authMiddleware (JWT), RBAC, Zod Validation │
│   - Socket.IO Server: Room-based routing (role:* & user:*)  │
│   - Controllers & Service Layer                             │
│   - Repositories: Prisma ORM + Redis Cache Layer           │
└───────────────────────────┬─────────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │   PostgreSQL    │       │   Redis Cache   │
      │   (Prisma DB)   │       │   (Invalidate)  │
      └─────────────────┘       └─────────────────┘
```

---

## 💻 Tech Stack

### Frontend (`client/`)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI primitives, Lucide React
- **Table / Data**: TanStack React Table
- **Real-Time Client**: Socket.IO Client (`socket.io-client`)
- **State & Notifications**: React Context (`AuthContext`, `SocketContext`), Sonner Toasts

### Backend (`server/`)
- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL via Prisma ORM
- **In-Memory Cache**: Redis (ioredis)
- **Real-Time Engine**: Socket.IO Server (`socket.io`)
- **Auth**: JWT stored in `httpOnly` secure cookies
- **Validation**: Zod schema validation
- **Asset Storage**: Cloudinary SDK

---

## 📁 Repository Directory Structure

```
alumnai/
├── .github/
│   └── workflows/
│       └── deploy-server.yml          # GitHub Actions: auto-deploy backend to VPS
├── Docs/
│   ├── README.md                      # Central Documentation Index
│   ├── SOCKET_IO_IMPLEMENTATION.md    # In-depth Socket.IO guide & reference
│   ├── PWA_IMPLEMENTATION.md          # In-depth PWA (manifest, service worker, headers) guide
│   └── VPS_DEPLOYMENT.md             # VPS deployment guide (Hostinger)
├── nginx/
│   └── conf.d/
│       └── default.conf               # Nginx reverse proxy + SSL config
├── client/
│   ├── app/                           # Next.js App Router pages and layouts
│   ├── components/                    # UI & Feature components (admin, auth, etc.)
│   ├── context/                       # AuthContext & SocketContext
│   ├── hooks/                         # Custom hooks (useAdminSocket, etc.)
│   ├── services/                      # Axios/fetch API service callers
│   └── lib/                           # Helpers, types, and utilities
├── docker-compose.yaml                # Docker Compose (production: Nginx + Certbot + Server)
└── server/
    ├── Dockerfile                     # Production Docker build for Express
    ├── prisma/                        # Database schema & migrations
    └── src/
        ├── config/                    # Environment variables & constants
        ├── controllers/               # Express request handlers
        ├── middlewares/               # Auth, RBAC, and Zod validator middlewares
        ├── repositories/              # Database queries + Redis caching
        ├── routes/                    # Route registration per domain
        ├── schema/                    # Zod validation schemas
        ├── services/                  # Business logic & socket emitters
        └── lib/                       # Prisma, Redis, JWT, Cloudinary & Socket manager
```

---

## 🔐 Authentication & Security Flow

1. **User Login**: `auth.service.ts` verifies credentials and issues a signed JWT `accessToken`.
2. **httpOnly Cookie**: The access token is stored in a secure, `httpOnly` cookie (`sameSite: "lax"`, `secure` in production).
3. **API Authorization**: `authMiddleware.execute` validates the token for each protected request and attaches `req.user` (`userId`, `role`, `type`).
4. **RBAC Protection**: `permittedRole([RoleType.ADMIN])` restricts endpoints to authorized roles.
5. **WebSocket Handshake**: Socket.IO extracts and validates the `accessToken` cookie from `socket.handshake.headers.cookie` before accepting connections.

---

## ⚡ Caching Strategy (Redis)

To ensure low latency and high scalability:
- **Cache Hits**: Reads check Redis first using scoped keys (`ENV.ADMIN_REDIS_KEY`, `ENV.ALUMNI_REDIS_KEY`).
- **Cache Invalidation**: Whenever a database mutation occurs (e.g., verifying a user, approving an alumni request), all relevant Redis cache keys are invalidated (`redis.del`) before or alongside emitting real-time socket events.

---

## 📡 Real-Time WebSocket Architecture (Socket.IO)

For detailed code patterns, connection lifecycles, and troubleshooting, refer to [Docs/SOCKET_IO_IMPLEMENTATION.md](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/Docs/SOCKET_IO_IMPLEMENTATION.md).

### Core Rooms
- `user:{userId}`: Private room for user-specific alerts and direct messages.
- `role:admin`: Admin channel for dashboard metric refreshes, unverified student alerts, and alumni upgrade requests.
- `role:alumni`: Alumni channel for mentorship and collaboration notifications.
- `role:student`: Student channel for status approval updates and mentorship responses.

### Admin Real-Time Events
- **Event**: `admin:refresh`
- **Payload**: `{ targets: AdminRefreshTarget[], message?: string }`
- **Target Channels**:
  - `"stats"`: Triggers refetching dashboard overview numbers.
  - `"unverified-users"`: Triggers refetching student verification queue.
  - `"all-users"`: Triggers refetching user management table.
  - `"alumni-requests"`: Triggers refetching alumni upgrade requests table.
  - `"top-mentors"`: Triggers refetching top-rated alumni mentors list.

### Student / Alumni Real-Time Events
- **Events**: `student:refresh`, `alumni:refresh` — same `{ targets, message? }` payload shape, role-specific target unions (e.g. `"collaboration-invites"`, `"manage-mentorships"`, `"stats"`).
- **Toasts**: a single `RefreshToasts` listener per role layout surfaces `message` on every authenticated page; list components refetch silently so toasts never double-fire.
- **Presence gating**: peer notifications go realtime-only when the recipient has a live socket, email-only when offline (Resend). Admin action emails always send. See [the presence-gating section](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/Docs/SOCKET_IO_IMPLEMENTATION.md) for the full rule and per-event table.

---

## 📱 Progressive Web App (PWA)

The client is an **installable PWA** built strictly with Next.js' official guide — web app manifest, generated icon set (including maskable + Apple Touch Icon), a minimal service worker, and hardened security headers. No extra dependencies.

For the full step-by-step implementation, icon safe-zone strategy, verification results, and troubleshooting, refer to [Docs/PWA_IMPLEMENTATION.md](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/Docs/PWA_IMPLEMENTATION.md).

### PWA Building Blocks
- **Manifest**: `client/app/manifest.ts` → serves `/manifest.webmanifest` (brand navy `#1A216D`, standalone display).
- **Service Worker**: `client/public/sw.js` (network-passthrough; no offline caching by design), registered via `client/components/pwa/register-sw.tsx` in the root layout.
- **Icons**: `client/public/icons/*` + `client/app/apple-icon.png` (auto-emitted `apple-touch-icon` link).

---

## 🌐 API Route Modules

| Domain | Route File | Purpose |
| :--- | :--- | :--- |
| **Auth** | [auth.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/auth.routes.ts) | Register, login, logout, password reset, session refresh |
| **Admin** | [admin.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/admin.routes.ts) | User verification, status suspension, alumni request review, metrics |
| **Alumni** | [alumni.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/alumni.routes.ts) | Student search, active mentees, mentorship invites, collaborations |
| **Student** | [student.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/student.routes.ts) | Alumni upgrade request submission, mentor discovery |
| **Mentorship** | [mentorship.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/mentorship.routes.ts) | Send, accept, decline, and complete mentorship requests |
| **Collaboration** | [collaboration.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/collaboration.routes.ts) | Project collaboration invitations and status management |
| **Profile** | [profile.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/profile.routes.ts) | Fetch and update user profiles, bio, and avatar |
| **Skills** | [skill.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/skill.routes.ts) | Skill endorsements, catalog, and profile skill management |
| **AI** | [ai.routes.ts](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/server/src/routes/ai.routes.ts) | AI-powered matchmaking and recommendations |

---

## ⚙️ Environment Variables Reference

### Client (`client/.env`)
```env
# Development
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Production (Vercel) — set these in Vercel dashboard
# NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
# NEXT_PUBLIC_BASE_URL=https://yourproject.vercel.app
```

### Server (`server/.env`)
```env
PORT=8000
NODE_ENV=development
APP_NAME=AlumnAI
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/alumnai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
GEMINI_KEY=your_gemini_key
GITHUB_PAT=your_github_pat
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=your_email@gmail.com
```

---

## 🖥️ VPS Deployment (Hostinger)

Full step-by-step guide to deploy the backend on a Hostinger VPS using Docker Compose, Nginx reverse proxy, and Let's Encrypt SSL. The frontend is deployed separately on Vercel.

For the complete guide, refer to [Docs/VPS_DEPLOYMENT.md](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/Docs/VPS_DEPLOYMENT.md).

### Quick Summary
1. Set up VPS (Ubuntu), install Docker
2. Clone repo, configure `server/.env` with production URLs
3. Set up Nginx reverse proxy with SSL (Let's Encrypt)
4. `docker compose up -d` to start backend services
5. Configure GitHub Actions for auto-deploy on push to `main`
6. Deploy frontend to Vercel separately

### Production Architecture
- **Frontend**: Deployed on Vercel (Next.js, free tier)
- **Backend**: VPS — Nginx + Express + Socket.IO (Port 8000)
- **Database**: Neon PostgreSQL (managed)
- **Cache**: Upstash Redis (managed)
- **Storage**: Cloudinary (managed)
