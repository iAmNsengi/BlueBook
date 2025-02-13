import express from "express";
import {
  createPost,
  getAllPosts,
  likePost,
} from "../controllers/post.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/add", isLoggedIn, createPost);
router.post("/:post_id/like", isLoggedIn, likePost);

export default router;
