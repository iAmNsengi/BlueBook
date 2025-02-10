import express from "express";

import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import postRoutes from "../routes/post.route.js";

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/messages", messageRoutes);
router.use("/api/posts", postRoutes);

export default router;
