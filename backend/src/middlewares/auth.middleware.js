import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized -- No token was provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Clear the invalid cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
        domain:
          process.env.NODE_ENV === "development"
            ? "localhost"
            : ".onrender.com",
        path: "/",
      });

      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token has expired - Please login again",
        });
      }

      return res.status(401).json({
        message: "Unauthorized -- Invalid token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password").lean(); // Use lean() for better performance

    if (!user) {
      // Clear cookie if user not found
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
        domain:
          process.env.NODE_ENV === "development"
            ? "localhost"
            : ".onrender.com",
        path: "/",
      });

      return res.status(404).json({
        message: "Unauthorized -- User not found",
      });
    }

    // Add token expiration time to request for potential refresh logic
    req.tokenExp = decoded.exp;
    req.user = user;
    next();
  } catch (error) {
    console.log(
      "An internal server error occurred in isLoggedIn middleware",
      error.message
    );

    // Clear cookie on server error to be safe
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
      domain:
        process.env.NODE_ENV === "development" ? "localhost" : ".onrender.com",
      path: "/",
    });

    return res.status(500).json({
      message: "An internal server error occurred - Please try again",
    });
  }
};
