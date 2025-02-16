import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cluster from "cluster";
import os from "os";

import appRoutes from "./routes/index.js";
import { connectDB } from "./utils/configs/db.js";
import { app, server } from "./utils/configs/socket.js";
import { corsOptions } from "./utils/configs/corsOptions.js";
import { requestsLimit } from "./utils/rateLimit.js";
import { errorResponse } from "./utils/responseHandlers.js";
import { initializeRedis } from "./utils/redis/redisClient.js";

dotenv.config();

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Setting up ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  app.use(corsOptions);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(compression());

  app.use(requestsLimit);
  app.use(appRoutes);
  app.use(errorResponse);

  // Initialize Redis connection
  initializeRedis();

  const startServer = async () => {
    const PORT = process.env.PORT || 3000;

    try {
      await new Promise((resolve, reject) => {
        server
          .listen(PORT, () => {
            console.log(
              `Server is listening on port ${PORT} - Worker ${process.pid}`
            );
            connectDB();
            resolve();
          })
          .on("error", (err) => {
            if (err.code === "EADDRINUSE") {
              console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
              server.listen(PORT + 1);
            } else {
              reject(err);
            }
          });
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
