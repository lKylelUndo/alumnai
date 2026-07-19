import { Server as SocketIOServer } from "socket.io";
import http from "http";
import app from "@/app";
import { ENV } from "@/config/env";

const startServer = () => {
  try {
    // Create standard http server and Express App
    const server = http.createServer(app);

    // Socketio instance
    const io = new SocketIOServer(server, {
      cors: {
        origin: ENV.FRONTEND_URL
      }
    });

    io.on("connection",(socket) => {
      //console.log("Client connected:", socket.id);

      socket.on("request", (msg) => {
        console.log("message:", msg);
      });

      // socket.on("disconnect", () => {
      //   console.log("Client disconnected");
      // });
    });
    
    server.listen(ENV.PORT, () => {
      console.log("--------------------------------------------------");
      console.log(`🚀 ${ENV.APP_NAME} started successfully!`);
      console.log(`📡 URL: ${ENV.BACKEND_URL}`);
      console.log(`🌍 MODE: ${ENV.NODE_ENV}`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ CRITICAL: Could not start the engine:", error);
    process.exit(1);
  }
};

startServer();
