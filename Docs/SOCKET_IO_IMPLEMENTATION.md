# 📡 Socket.IO Real-Time Implementation Guide

This document provides a complete, start-to-finish reference and code templates for the **Socket.IO Real-Time Architecture** implemented in the **AlumnAI** platform (Express + Next.js App Router), including a comprehensive breakdown of core WebSocket / Socket.IO concepts.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [WebSocket & Socket.IO Core Terminologies Cheat Sheet](#2-websocket--socketio-core-terminologies-cheat-sheet)
3. [Backend Implementation (Server)](#3-backend-implementation-server)
   - [Socket Manager & Cookie Authentication](#a-socket-manager--authentication-serversrclibsocketts)
   - [Server Entry Point](#b-server-entry-point-serversrcserverts)
   - [Triggering Events from Services](#c-triggering-real-time-events-from-services)
   - [Redis Cache Invalidation Workflow](#d-redis-cache-invalidation-workflow)
4. [Frontend Implementation (Client)](#4-frontend-implementation-client)
   - [Global Socket Context](#a-socket-context-clientcontextsocketcontexttsx)
   - [Root Layout Integration](#b-root-layout-clientapplayouttsx)
   - [Consumer Custom Hook](#c-consumer-hook-clienthooksuseadminsocketts)
5. [Component Implementation Examples](#5-component-implementation-examples)
   - [Example A: Alumni Status Requests (with Toast Alert)](#example-a-alumni-status-requests-with-toast-alert)
   - [Example B: User Management](#example-b-user-management)
   - [Example C: Admin Metric Cards](#example-c-admin-metric-cards)
   - [Tab Persistence with Radix UI (`forceMount`)](#tab-persistence-with-radix-ui-tabscontent)
6. [Real-Time Chat & User Notifications (Extension Template)](#6-real-time-chat--user-notifications-extension-template)
7. [Troubleshooting & Common Gotchas](#7-troubleshooting--common-gotchas)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       NEXT.JS CLIENT                        │
│                                                             │
│   AuthContext ───► SocketProvider ───► useAdminSocket       │
│                           │ (withCredentials: true)         │
└───────────────────────────┼─────────────────────────────────┘
                            │ WebSocket Handshake
                            ▼ (Sends httpOnly accessToken Cookie)
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND                        │
│                                                             │
│   1. Cookie Parser extracts `accessToken`                   │
│   2. `verifyAccessToken(token)` verifies JWT                │
│   3. Socket joins rooms:                                    │
│      - `user:{userId}` (Private User Room)                  │
│      - `role:{role}`   (e.g., `role:admin`, `role:student`) │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Emits via notifyRole / notifyUser
┌───────────────────────────┴─────────────────────────────────┐
│                    SERVICES & CONTROLLERS                   │
│                                                             │
│   1. Perform DB Mutation (Prisma)                           │
│   2. Invalidate Redis Cache (redis.del)                     │
│   3. notifyRole("admin", "admin:refresh", { targets: ... }) │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles
- **Hybrid SSR + Real-Time**: Next.js Server Components render initial HTML fast via SSR. Socket.IO mounts on the client (`"use client"`) to receive live incremental updates without page reloads.
- **httpOnly Cookie Handshake**: No client-side JWT token needs to be manually passed in props. The browser automatically sends the secure cookie during the socket handshake.
- **Room-Based Targeting**: Users join their personal room (`user:{userId}`) and their role room (`role:{role}`). Events are broadcast only to the intended audience.

---

## 2. WebSocket & Socket.IO Core Terminologies Cheat Sheet

| Term / Method | Scope | What it Does | Real Example in AlumnAI |
| :--- | :--- | :--- | :--- |
| **`socket.emit(event, data)`** | Client / Server | **Sends** a named event with a payload from the current socket to the other side. | `socket.emit("send_message", { text: "Hello" })` |
| **`socket.on(event, handler)`** | Client / Server | **Listens** for an incoming event and triggers the handler function whenever that event fires. | `socket.on("admin:refresh", (data) => refetch())` |
| **`socket.off(event, handler)`** | Client / Server | **Removes** an event listener to prevent memory leaks and duplicate executions when React components unmount. | `return () => { socket.off("admin:refresh", handler) }` |
| **`socket.once(event, handler)`** | Client / Server | Listens for an event **only once**, then automatically deregisters itself. | `socket.once("connected_ack", () => ...)` |
| **`io.to(room).emit(...)`** | Server | **Broadcasts** an event to **every socket that joined a specific room** (e.g. all admins or one specific user). | `io.to("role:admin").emit("admin:refresh", payload)` |
| **`io.emit(...)`** | Server | **Broadcasts to all connected clients** on the entire server regardless of room. | `io.emit("system_announcement", { msg: "Maintenance" })` |
| **`socket.broadcast.emit(...)`**| Server | Broadcasts to **all connected clients EXCEPT the sender**. | `socket.broadcast.emit("user_typing", { userId })` |
| **`socket.join(room)`** | Server | Adds a socket connection to a logical channel (room). | `socket.join("role:admin")` / `socket.join("user:123")` |
| **`socket.leave(room)`** | Server | Removes a socket connection from a room. | `socket.leave("chat_room_456")` |
| **`io.use((socket, next))`** | Server | **Middleware** that executes before a socket connection is accepted (used for JWT validation). | Checking `accessToken` cookie in handshake before `next()` |
| **`socket.handshake`** | Server | Object containing metadata sent during the initial HTTP upgrade request (headers, cookies, query, auth). | `socket.handshake.headers.cookie` |
| **`socket.id`** | Client / Server | A unique string identifier assigned to each active connection. | `Connected: 921d96aa-1a49-469d` |
| **`withCredentials: true`** | Client / Server | Allows cross-origin requests to send and receive **httpOnly cookies**. | Passed in Next.js `io(url, { withCredentials: true })` |
| **`transports`** | Client | Transport protocols used (`["websocket", "polling"]`). WebSockets are tried first, falling back to HTTP long-polling if blocked. | `transports: ["websocket", "polling"]` |

---

## 3. Backend Implementation (Server)

### A. Socket Manager & Authentication (`server/src/lib/socket.ts`)

```typescript
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";

let io: SocketIOServer | null = null;

// Socket.IO doesn't use Express cookie-parser, so cookies are parsed from handshake headers
function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...rest] = cookie.trim().split("=");
      return [key, rest.join("=")];
    })
  );
}

export const initSocket = (server: HttpServer, corsOrigin: string) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: corsOrigin,
      credentials: true,
    },
  });

  // 1. Authenticate using httpOnly cookies (Middleware)
  io.use((socket: Socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Authentication error: No token"));
      }

      const payload = verifyAccessToken(accessToken);
      if (!payload) {
        return next(new Error("Authentication error: Invalid token"));
      }

      // Attach user payload to socket
      socket.data.user = payload;
      return next();
    } catch {
      return next(new Error("Authentication failed"));
    }
  });

  // 2. Assign Rooms on Connection
  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as JwtPayload;
    console.log(`Connected: ${socket.id} (${user.role}: ${user.userId})`);

    // Personal Room (Direct Messages & Alerts)
    socket.join(`user:${user.userId}`);

    // Role-based Rooms
    if (user.role === "ADMIN") {
      socket.join("role:admin");
    } else if (user.role === "ALUMNI") {
      socket.join("role:alumni");
    } else if (user.role === "STUDENT") {
      socket.join("role:student");
    }

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  return io;
};

// -------------------------------------------------------------
// Helper Broadcast Functions
// -------------------------------------------------------------

/**
 * Emit an event to all users in a specific role
 */
export const notifyRole = (
  role: "admin" | "alumni" | "student",
  event: string,
  payload: any
) => {
  io?.to(`role:${role}`).emit(event, payload);
};

/**
 * Emit an event to a single specific user
 */
export const notifyUser = (userId: string, event: string, payload: any) => {
  io?.to(`user:${userId}`).emit(event, payload);
};
```

---

### B. Server Entry Point (`server/src/server.ts`)

```typescript
import http from "http";
import app from "@/app";
import { ENV } from "@/config/env";
import { initSocket } from "./lib/socket";

const startServer = () => {
  try {
    const server = http.createServer(app);

    // Initialize Socket.IO with CORS origin
    initSocket(server, ENV.FRONTEND_URL);

    server.listen(ENV.PORT, () => {
      console.log("--------------------------------------------------");
      console.log(`${ENV.APP_NAME} started successfully!`);
      console.log(`URL: ${ENV.BACKEND_URL}`);
      console.log(`MODE: ${ENV.NODE_ENV}`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("CRITICAL: Could not start the engine:", error);
    process.exit(1);
  }
};

startServer();
```

---

### C. Triggering Real-Time Events from Services

Whenever a database mutation occurs that affects another role's dashboard, call `notifyRole` in the service:

**Example: Student submits Alumni Upgrade Request (`server/src/services/alumni/request.alumni.upgrade.service.ts`)**
```typescript
import { AlumniRepository } from "@/repositories/alumni.repository";
import { uploadImage } from "@/lib/cloudinary";
import { notifyRole } from "@/lib/socket";

export const RequestAlumniUpgradeService = async (userId: string, documentUrl: string) => {
  const alumniRepository = new AlumniRepository();

  try {
    const existing = await alumniRepository.findExistingPendingRequest(userId);
    if (existing) {
      return { code: 400, status: "error", message: "You already have a pending request." };
    }

    let uploadedUrl = documentUrl;
    if (documentUrl.startsWith("data:image") || documentUrl.startsWith("data:application/pdf")) {
       const uploadResult = await uploadImage(documentUrl, "alumnai-documents");
       uploadedUrl = uploadResult.secure_url;
    }

    const request = await alumniRepository.createAlumniUpgradeRequest(userId, uploadedUrl);

    // 📡 Real-time alert to all connected admins
    notifyRole("admin", "admin:refresh", {
      targets: ["alumni-requests"],
      message: "A new student has submitted an alumni upgrade request!",
    });

    return {
      code: 201,
      status: "success",
      message: "Alumni upgrade request submitted successfully",
      data: request,
    };
  } catch (error) {
    console.error("RequestAlumniUpgradeService", error);
    return { code: 500, status: "error", message: "Unable to submit alumni upgrade request" };
  }
};
```

---

### D. Redis Cache Invalidation Workflow

> [!IMPORTANT]
> **Always delete the Redis cache key before or alongside sending a socket emit.** If the cache is not deleted, client components will re-fetch data from the API and receive the old cached data.

**Example: `server/src/repositories/alumni.repository.ts`**
```typescript
async approveAlumniRequest(studentId: string) {
  const user = await prisma.user.findUnique({
    where: { student_id_number: studentId },
  });

  if (!user) return null;

  // 1. Database Mutation
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ALUMNI" },
  });

  // 2. Invalidate all affected Redis cache keys
  await redis.del(`${ENV.ALUMNI_REDIS_KEY}alumni-requests`);
  await redis.del(`${ENV.ADMIN_REDIS_KEY}all-users`);
  await redis.del(`${ENV.ADMIN_REDIS_KEY}dashboard-stats`);

  return { updatedUser };
}
```

---

## 4. Frontend Implementation (Client)

### A. Socket Context (`client/context/SocketContext.tsx`)

Manages a single global connection that connects on login and disconnects on logout:

```tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/context/AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthContext();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect when user is authenticated
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Connect to server (cookies sent automatically via withCredentials)
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.IO");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.IO");
      setIsConnected(false);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
}
```

---

### B. Root Layout (`client/app/layout.tsx`)

Wrap inside `AuthProvider` and include `Toaster`:

```tsx
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### C. Consumer Hook (`client/hooks/useAdminSocket.ts`)

Allows any admin component to subscribe to specific refresh targets with optional message payload. Uses a mutable `useRef` to maintain the latest callback instance without triggering re-subscriptions:

```typescript
"use client"

import { useEffect, useRef } from "react"
import { useSocketContext } from "@/context/SocketContext"

type AdminRefreshTarget =
  | "stats"
  | "unverified-users"
  | "all-users"
  | "alumni-requests"
  | "top-mentors"

interface UseAdminSocketOptions {
  target: AdminRefreshTarget
  onRefresh: (data?: { targets: AdminRefreshTarget[]; message?: string }) => void
}

export function useAdminSocket({ target, onRefresh }: UseAdminSocketOptions) {
  const { socket, isConnected } = useSocketContext()
  const onRefreshRef = useRef(onRefresh)

  // Keep latest callback reference without triggering re-subscription
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  useEffect(() => {
    if (!socket) return

    const handleRefresh = (data: { targets: AdminRefreshTarget[]; message?: string }) => {
      if (data?.targets?.includes(target)) {
        onRefreshRef.current?.(data)
      }
    }

    socket.on("admin:refresh", handleRefresh)

    return () => {
      socket.off("admin:refresh", handleRefresh)
    }
  }, [socket, target])

  return { isConnected }
}
```

---

## 5. Component Implementation Examples

### Example A: Alumni Status Requests (with Toast Alert)
**File: `client/components/features/admin/AlumniRequest.tsx`**

```tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { adminService } from "@/services/admin.service"
import { useAdminSocket } from "@/hooks/useAdminSocket"
import { toast } from "sonner"
import type { AlumniRequest } from "@/lib/types/alumni"
import { DataTable } from "@/components/common/tables/DataTable"

export default function AlumniRequest({ data: initialData }: { data: AlumniRequest[] }) {
  const [requests, setRequests] = useState<AlumniRequest[]>(initialData ?? [])

  const refetchAlumniRequests = useCallback(() => {
    adminService.getAlumniRequest()
      .then((res) => {
        if (res?.data?.requests) {
          setRequests(res.data.requests)
        }
      })
      .catch((err) => console.error("Client fetch alumni requests failed:", err))
  }, [])

  // Listen for realtime updates when a student submits an alumni request
  useAdminSocket({
    target: "alumni-requests",
    onRefresh: (data) => {
      if (data?.message) {
        toast.info(data.message)
      } else {
        toast.info("A new alumni upgrade request has been submitted!")
      }
      refetchAlumniRequests()
    },
  })

  useEffect(() => {
    refetchAlumniRequests()
  }, [refetchAlumniRequests])

  return (
    <div>
      {/* DataTable rendering requests */}
    </div>
  )
}
```

---

### Example B: User Management
**File: `client/components/features/admin/UserManagement.tsx`**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { useAdminSocket } from "@/hooks/useAdminSocket";

export default function UserManagement({ data: initialData }: { data: any[] }) {
  const [users, setUsers] = useState<any[]>(initialData ?? []);

  const refetchUsers = useCallback(() => {
    adminService.getAllUsers()
      .then((res) => {
        if (res?.data?.users) {
          setUsers(res.data.users);
        }
      })
      .catch((err) => console.error("Refetch users failed:", err));
  }, []);

  useAdminSocket({ target: "all-users", onRefresh: refetchUsers });

  useEffect(() => {
    refetchUsers();
  }, [refetchUsers]);

  return (
    <div>
      {/* DataTable rendering users */}
    </div>
  );
}
```

---

### Example C: Admin Metric Cards
**File: `client/components/features/admin/AdminStatCards.tsx`**

```tsx
"use client";

import { useState, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { useAdminSocket } from "@/hooks/useAdminSocket";

export default function AdminStatCards({ data: initialData }: { data: any }) {
  const [stats, setStats] = useState(initialData);

  const refetchStats = useCallback(() => {
    adminService.getDashboardStats()
      .then((res) => {
        if (res?.data) setStats(res.data);
      })
      .catch((err) => console.error("Refetch stats failed:", err));
  }, []);

  useAdminSocket({ target: "stats", onRefresh: refetchStats });

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Render stats */}
    </div>
  );
}
```

---

### Tab Persistence with Radix UI (`TabsContent`)
In [AdminDashboard.tsx](file:///c:/Users/Kyle%20Ando/Desktop/practice/alumnai/client/components/features/admin/AdminDashboard.tsx), use `forceMount` so inactive tabs maintain their socket listeners in the background:

```tsx
<TabsContent value="verify-students" forceMount className="mt-4 data-[state=inactive]:hidden">
  <VerifyStudents data={unverifiedUsers?.data?.users ?? []} />
</TabsContent>

<TabsContent value="alumni-request" forceMount className="mt-4 data-[state=inactive]:hidden">
  <AlumniRequest data={alumniRequest?.data?.requests ?? []} />
</TabsContent>

<TabsContent value="manage-users" forceMount className="mt-4 data-[state=inactive]:hidden">
  <UserManagement data={allUsers?.data?.users ?? []} />
</TabsContent>
```

---

## 6. Real-Time Chat & User Notifications (Extension Template)

When you are ready to implement 1-on-1 real-time chat between students and alumni:

### Backend: Send Message Service
```typescript
import { notifyUser } from "@/lib/socket";
import { prisma } from "@/lib/prisma";

export const SendMessageService = async (senderId: string, recipientId: string, content: string) => {
  const message = await prisma.message.create({
    data: {
      senderId,
      content,
      // ...conversation relation
    },
  });

  // 📡 Emit directly to the recipient's private room
  notifyUser(recipientId, "chat:new_message", {
    id: message.id,
    senderId,
    content: message.content,
    createdAt: message.createdAt,
  });

  return message;
};
```

### Frontend: Chat Consumer Hook / Component
```tsx
"use client";

import { useState, useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";

export function useChatMessages(initialMessages: any[]) {
  const [messages, setMessages] = useState(initialMessages);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat:new_message", handleNewMessage);

    return () => {
      socket.off("chat:new_message", handleNewMessage);
    };
  }, [socket]);

  return { messages, setMessages };
}
```

---

## 7. Troubleshooting & Common Gotchas

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **Data in UI remains old after socket emit** | Redis cache was not deleted before the client re-fetched. | Call `await redis.del(...)` for all affected keys in the repository. |
| **Tab doesn't update when clicked** | Radix unmounted the tab and loaded stale SSR `initialData`. | Add `forceMount` to `<TabsContent>` and call `refetch()` in `useEffect`. |
| **Socket connects & disconnects rapidly** | Next.js Strict Mode runs effects twice in dev, or auth state fluctuates. | Expected in development Strict Mode; in production it mounts once. |
| **401 Authentication error in socket** | Browser didn't pass cookie or handshake failed. | Ensure `withCredentials: true` is set on both server and client configs. |
