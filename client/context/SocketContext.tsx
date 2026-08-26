"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as SocketIOClient, Socket } from "socket.io-client";
import { useAuthContext } from "@/context/AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect when user is authenticated
    if (!isAuthenticated || !user) {
      setSocket((prev) => {
        if (prev) prev.disconnect();
        return null;
      });
      setIsConnected(false);
      return;
    }

    // Create socket connection (cookies sent automatically via withCredentials)
    const socketInstance = SocketIOClient(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketInstance);

    const onConnect = () => {
      console.log(`Connected to Socket.IO | User: ${user?.role} - ${user?.id}`);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log(`Disconnected from Socket.IO | User: ${user?.role} - ${user?.id}`);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error("Socket connection error:", err.message);
    };

    // Listen to socket events and runs these functions once they are connected
    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on("connect_error", onConnectError);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("connect_error", onConnectError);
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
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