import http from "http";
import app from "@/app";
import { ENV } from "@/config/env";
import { initSocket } from "./lib/socket";

const startServer = () => {
  try {

    // Create standard http server and Express App
    const server = http.createServer(app);

    //  Initialize Socket.IO
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
