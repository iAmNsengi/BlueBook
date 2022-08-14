import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Cookie configuration based on environment
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // prevent XSS attacks
    sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
    secure: process.env.NODE_ENV !== "development",
    // Remove domain setting in production
    ...(process.env.NODE_ENV === "development" && { domain: "localhost" }),

    path: "/", // Ensuring cookie is available across all paths
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};
