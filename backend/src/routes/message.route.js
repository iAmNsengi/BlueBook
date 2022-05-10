import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/user", isLoggedIn, getUsersForSidebar);

export default router;
