import express from "express";

import {
  checkAuth,
  deleteAccount,
  findUsers,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  loginRequestsLimiter,
  signupRequestsLimiter,
} from "../utils/rateLimit.js";

const router = express.Router();

router.use("/signup", signupRequestsLimiter);
router.post("/signup", signup);

router.use("/login", loginRequestsLimiter);
router.post("/login", login);

router.post("/logout", logout);
router.put("/update-profile", isLoggedIn, updateProfile);
router.delete("/delete-account", isLoggedIn, deleteAccount);

router.post("/findUsers", isLoggedIn, findUsers);

router.get("/check", isLoggedIn, checkAuth);

export default router;
