import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cluster from "cluster";
import os from "os";

import appRoutes from "./routes/index.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { corsOptions } from "./lib/corsOptions.js";
import { requestsLimit } from "./utils/rateLimit.js";

dotenv.config();

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart the worker
  });
} else {
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(compression());

  app.use(corsOptions);
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.use(requestsLimit);
  app.use(appRoutes);

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    connectDB();
  });
}
