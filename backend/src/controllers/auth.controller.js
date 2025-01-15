import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import RegexCraft from "regexcraft";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const passwordValidator = new RegexCraft().hasMinLength(6);
  const emailValidator = new RegexCraft().isEmail();
  console.log(passwordValidator.testOne(password));

  try {
    if (!passwordValidator.testOne(password).isValid)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    if (!emailValidator.testOne(email).isValid)
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
      generateToken(newUser._id, res);
      await newUser.save();
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

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
