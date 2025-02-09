import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

import appRoutes from "./routes/index.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { corsOptions } from "./lib/corsOptions.js";
import { requestsLimit } from "./utils/rateLimit.js";

dotenv.config();

const PORT = process.env.PORT;

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

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();
});
