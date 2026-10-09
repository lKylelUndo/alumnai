import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";

let io: SocketIOServer | null = null;

// Socket.IO doesn't use cookie-parser, so we parse cookies manually
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

    // 1. Authenticate using httpOnly cookies (same as Express auth middleware)
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

            // Store verified payload on socket (matches JwtPayload: userId, role, type)
            socket.data.user = payload;
            return next();
        } catch {
            return next(new Error("Authentication failed"));
        }
    });

    // 2. Route Connection to Appropriate Rooms
    io.on("connection", (socket: Socket) => {
        const user = socket.data.user as JwtPayload;
        console.log(`Connected: Socket ID: ${socket.id} | User: ${user.role} - ${user.userId}`);

        // Personal room (for direct messages or personal alerts)
        socket.join(`user:${user.userId}`);

        // Role-based rooms
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

// Helper emitters for any backend controller/service:
export const notifyRole = (role: "admin" | "alumni" | "student", event: string, payload: any) => {
    io?.to(`role:${role}`).emit(event, payload);
};

export const notifyUser = (userId: string, event: string, payload: any) => {
    io?.to(`user:${userId}`).emit(event, payload);
};

// Presence check: does this user currently hold a live socket connection?
// Members join `user:${userId}` on connect, so an empty (or missing) room means
// offline. When `io` is not initialised yet this returns false, which is the
// safe default — callers fall back to email.
export function isUserOnline(userId: string): boolean {
    return (io?.sockets.adapter.rooms.get(`user:${userId}`)?.size ?? 0) > 0;
}

