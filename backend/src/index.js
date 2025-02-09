import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { corsOptions } from "./lib/corsOptions.js";
import appRoutes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(corsOptions);

// Add security headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(appRoutes);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();
});
