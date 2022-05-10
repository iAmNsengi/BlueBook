import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", isLoggedIn, getUsersForSidebar);
router.get("/:id", isLoggedIn, getMessages);

export default router;
