import express from "express";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", (req, res) => {
  res.send("login route");
});

router.post("/logout", (req, res) => {
  res.send("logout route");
});

export default router;
