import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/posts", isLoggedIn, getAllPosts);

export default router;
