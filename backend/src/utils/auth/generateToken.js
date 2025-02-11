import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  try {
    console.log(userId, "user id in generate token");

    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  } catch (error) {
    console.error("Error in generateToken:", error);
    throw error;
  }
};
