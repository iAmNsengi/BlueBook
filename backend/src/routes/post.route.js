import express from "express";
import { createPost, getAllPosts } from "../controllers/post.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/add", isLoggedIn, createPost);

export default router;
