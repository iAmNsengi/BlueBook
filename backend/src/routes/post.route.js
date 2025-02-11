import express from "express";
import { createPost, getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/add", createPost);

export default router;
