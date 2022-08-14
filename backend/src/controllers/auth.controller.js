import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import RegexCraft from "regexcraft";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const passwordValidator = new RegexCraft()
    .hasMinLength(8)
    .hasUpperCase(1)
    .hasNumber(1)
    .hasSpecialCharacter(1);
  const emailValidator = new RegexCraft().isEmail();
  const fullNameValidator = new RegexCraft().hasLetter(3).hasNoNumber();

  try {
    if (!fullNameValidator.testOne(fullName.trim()).isValid)
      return res.status(400).json({
        message: "Full name should have at least 3 characters and no numbers",
      });

    if (!passwordValidator.testOne(password.trim()).isValid)
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, 1 uppercase letters,  number and 1 special character",
      });

    if (!emailValidator.testOne(email.trim()).isValid)
      return res.status(400).json({ message: "Invalid email" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashedPassword });

    if (newUser) {
      await newUser.save();

      generateToken(newUser._id, res);

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else return res.status(400).json({ message: "Invalid User data" });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res
      .status(500)
      .json({ message: `Internal Server Error, ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Clear any existing cookies first
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
      path: "/",
      ...(process.env.NODE_ENV === "development" && { domain: "localhost" }),
    });

    // Generate new token
    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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
