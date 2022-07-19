import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", isLoggedIn, getUsersForSidebar);
router.get("/:id", isLoggedIn, getMessages);

router.post("/send/:id", isLoggedIn, sendMessage);

export default router;
