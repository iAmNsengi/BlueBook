import os from "os";
import cluster from "cluster";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

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
  console.log(`Master ${process.pid} is running`);

  // Create server and start listening in the master process
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    connectDB();
  });

  // Then fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart the worker
  });
} else {
  // Worker processes only need to set up the Express middleware and routes
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

  console.log(`Worker ${process.pid} started`);
}
