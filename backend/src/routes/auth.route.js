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

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", isLoggedIn, updateProfile);
router.delete("/delete-account", isLoggedIn, deleteAccount);

router.post("/findUsers", isLoggedIn, findUsers);

router.get("/check", isLoggedIn, checkAuth);

export default router;
