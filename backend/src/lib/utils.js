import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
      secure: process.env.NODE_ENV !== "development",
      path: "/",
      ...(process.env.NODE_ENV === "development" && { domain: "localhost" }),
    };

    console.log("Setting cookie with options:", {
      ...cookieOptions,
      token: token.slice(0, 10) + "...", // Log part of token for debugging
    });

    res.cookie("jwt", token, cookieOptions);

    // Verify cookie was set
    const cookies = res.getHeader("Set-Cookie");
    console.log(cookies);

    if (!cookies) {
      console.log("Warning: Cookie header not set after res.cookie()");
    } else {
      console.log("Cookie header set successfully");
    }

    return token;
  } catch (error) {
    console.error("Error in generateToken:", error);
    throw error;
  }
};
