import { generateToken } from "../utils/auth/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/configs/cloudinary.js";
import catchAsync from "../utils/catchAsync.js";
import { successResponse } from "../utils/responseHandlers.js";
import validateRequestBody from "../utils/validateRequestBody.js";

export const signup = catchAsync(async (req, res, next) => {
  validateRequestBody(req, res);
  const { fullName, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ fullName, email, password: hashedPassword });
  user.password = undefined;
  const token = generateToken(user._id);
  return successResponse(res, 201, { user, token });
});

export const login = catchAsync(async (req, res, next) => {
  validateRequestBody(req, res);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Invalid login credentials", 400));
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect)
    return next(new AppError("Invalid login credentials", 400));
  const token = generateToken(user._id);
  user.password = undefined;
  return successResponse(res, 200, { user, token });
});

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
      path: "/",
      ...(process.env.NODE_ENV === "development" && { domain: "localhost" }),
    });
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
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
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("An internal server error occurred", error.message);
    return res
      .status(500)
      .json({ message: `An internal server error occurred, ${error.message}` });
  }
};

export const findUsers = async (req, res) => {
  try {
    const { search } = req.body;
    const { user } = req;

    const users = await User.find({
      fullName: { $regex: search, $options: "i" },
      _id: { $ne: user._id },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in findusers", error);
    return res
      .status(500)
      .json({ message: `Error in findUsers, ${error.message}` });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log(deleteAccount);

    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("An error occurred in deleteAccount", error);
    return res
      .status(500)
      .json({ message: `An internal server error occurred, ${error.message}` });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("An internal server error occurred", error.message);
    return res.status(500).json({
      message: `An internal server error occurred, ${error.message}`,
    });
  }
};
