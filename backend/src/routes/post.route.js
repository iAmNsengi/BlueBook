import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", isLoggedIn, getAllPosts);

router.post("/add", isLoggedIn, createPost);

export default router;
