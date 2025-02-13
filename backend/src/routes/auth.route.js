import express from "express";

import {
  checkAuth,
  deleteAccount,
  findUsers,
  forgotPassword,
  googleAuth,
  login,
  logout,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  loginRequestsLimiter,
  signupRequestsLimiter,
} from "../utils/rateLimit.js";
import { validateSignupRequest } from "../utils/validators/signup.request.validator.js";
import loginRequestBodyValidator from "../utils/validators/login.request.validator.js";
import googleAuthRequestBodyValidator from "../utils/validators/gogleAuth.request.validator.js";
import forgotPasswordRequestBodyValidator from "../utils/validators/forgotPassword.request.validator.js";

const router = express.Router();

router.use("/signup", signupRequestsLimiter);
router.post("/signup", validateSignupRequest, signup);

router.use("/login", loginRequestsLimiter);
router.post("/login", loginRequestBodyValidator, login);

router.post("/google", googleAuthRequestBodyValidator, googleAuth);

router.post("/logout", logout);
router.delete("/delete-account", isLoggedIn, deleteAccount);

router.post(
  "/forgot-password",
  forgotPasswordRequestBodyValidator,
  forgotPassword
);
router.post("/reset-password/:token", resetPassword);

router.post("/findUsers", isLoggedIn, findUsers);

router.get("/check/", isLoggedIn, checkAuth);

export default router;
