import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
              .json({ message: "Unauthorized -- No token was provided" });
    
    next();
  } catch (error) {}
};
