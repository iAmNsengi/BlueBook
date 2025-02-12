import express from "express";

import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import postRoutes from "../routes/post.route.js";
import userRoutes from "../routes/user.route.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/user", isLoggedIn, userRoutes);
router.use("/api/messages", isLoggedIn, messageRoutes);
router.use("/api/posts", isLoggedIn, postRoutes);

export default router;
