import express from "express";
import { updateProfile } from "../controllers/auth.controller.js";

const router = express.Router();

router.put("/update-profile", updateProfile);

export default router;
