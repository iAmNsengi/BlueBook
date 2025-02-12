import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pkg from "google-auth-library";
import nodemailer from "nodemailer";
const { OAuth2Client } = pkg;

import User from "../models/user.model.js";
import cloudinary from "../utils/configs/cloudinary.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import validateRequestBody from "../utils/validateRequestBody.js";
import { successResponse } from "../utils/responseHandlers.js";
import { generateToken } from "../utils/auth/generateToken.js";
import { retryMiddleware } from "../middlewares/retry.middleware.js";
import redisClient from "../utils/redis/redisClient.js";
import { sendEmail } from "../utils/emails/sendEmail.js";
import { createResetPasswordEmailTemplate } from "../utils/emails/emailTemplates.js";
import PasswordResets from "../models/passwordResets.model.js";

export const signup = retryMiddleware(
  catchAsync(async (req, res, next) => {
    validateRequestBody(req, res);
    const { fullName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    user.password = undefined;
    const token = generateToken(user._id);
    redisClient.set(`User:${user?.email}`, token);
    return successResponse(res, 201, { user, token });
  })
);

export const login = retryMiddleware(
  catchAsync(async (req, res, next) => {
    validateRequestBody(req, res);
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new AppError("Invalid login credentials", 400));
    const passwordIsCorrect = await bcrypt.compare(password, user?.password);
    if (!passwordIsCorrect)
      return next(new AppError("Invalid login credentials", 400));
    const token = generateToken(user._id);
    console.log(token);
    user.password = undefined;
    redisClient.set(`User:${user?.email}`, token);
    return successResponse(res, 200, { user, token });
  })
);

export const googleAuth = retryMiddleware(
  catchAsync(async (req, res, next) => {
    // validateRequestBody(req, res);
    const client = new OAuth2Client();
    const { credential, client_id } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });
    const payload = ticket.getPayload();
    const { name, given_name, email } = payload;
    const userWithEmailExists = await User.findOne({ email });
    if (userWithEmailExists) {
      const token = generateToken(userWithEmailExists?._id);
      return successResponse(res, 200, { user: userWithEmailExists, token });
    }
    const newUser = await User.create({
      fullName: `${given_name} ${name}`,
      email,
      source: "google",
    });
    const token = generateToken(newUser._id);
    return successResponse(res, 201, { user: newUser, token });
  })
);

export const logout = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);

  const blacklistKey = `blacklist:${decoded.userId}:${decoded.iat}`;

  await redisClient.setEx(
    blacklistKey,
    decoded.exp - Math.floor(Date.now() / 1000),
    token
  );
  return successResponse(res, 200, "Logged out successfully");
});

export const forgotPassword = retryMiddleware(
  catchAsync(async (req, res, next) => {
    // validateRequestBody(req, res);
    const { email } = req.body;
    const userWithEmailExists = await User.findOne({ email });
    if (!userWithEmailExists)
      return next(
        new AppError(
          "User with e-mail couldn't be found, consider creating an account",
          404
        )
      );
    const token = jwt.sign(
      { email: userWithEmailExists?.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "15min",
      }
    );
    const resetUrl = `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://vuga.onrender.com"
    }/auth/reset-password/${token}`;

    await sendEmail(
      userWithEmailExists.email,
      "Password Reset | Vuga ChatApp",
      createResetPasswordEmailTemplate(userWithEmailExists?.fullName, resetUrl)
    );
    return successResponse(res, 200, { token });
  })
);

export const resetPassword = retryMiddleware(
  catchAsync(async (req, res, next) => {
    const { token } = req.params;

    const { password } = req.body;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (!email) return next(new AppError("Invalid token", 400));
    const userWithEmailExists = await User.findOne({ email }).select(
      "+password"
    );

    if (!userWithEmailExists)
      return next(new AppError("User with email doesn't exist", 404));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    userWithEmailExists.password = hashedPassword;
    await userWithEmailExists.save();
    userWithEmailExists.password = undefined;
    return successResponse(res, 200, { user: userWithEmailExists });
  })
);

export const updateProfile = catchAsync(async (req, res, next) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  if (!profilePic)
    return res.status(400).json({ message: "Profile picture is required!" });
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePic: uploadResponse.secure_url,
    },
    { new: true }
  );
  return successResponse(res, 200, updatedUser);
});

export const findUsers = catchAsync(async (req, res, next) => {
  const { search } = req.body;
  const users = await User.find({
    fullName: { $regex: search, $options: "i" },
    _id: { $ne: req?.user._id },
  });
  return successResponse(res, 200, users);
});

export const deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  await User.findByIdAndDelete(userId);
  return successResponse(res, 200, { message: "Account deleted successfully" });
});

export const checkAuth = catchAsync((req, res, next) =>
  res.status(200).json(req.user)
);
