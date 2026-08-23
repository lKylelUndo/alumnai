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
7. [API Route Modules](#api-route-modules)
8. [Environment Variables Reference](#environment-variables-reference)

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
├── Docs/
│   ├── README.md                      # Central Documentation Index
│   └── SOCKET_IO_IMPLEMENTATION.md    # In-depth Socket.IO guide & reference
├── client/
│   ├── app/                           # Next.js App Router pages and layouts
│   ├── components/                    # UI & Feature components (admin, auth, etc.)
│   ├── context/                       # AuthContext & SocketContext
│   ├── hooks/                         # Custom hooks (useAdminSocket, etc.)
│   ├── services/                      # Axios/fetch API service callers
│   └── lib/                           # Helpers, types, and utilities
└── server/
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
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
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
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_REDIS_KEY=admin:
ALUMNI_REDIS_KEY=alumni:
STUDENT_REDIS_KEY=student:
```
