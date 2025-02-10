import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import redisClient from "../utils/redis/client.js";

export const isLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.headers?.authorization.split(" ")[1];

  if (!token)
    return next(new AppError("Unauthorized, you need to be logged in", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password").lean();
  if (!user)
    return next(new AppError("Unauthorized, you need to be logged in", 401));

  const blacklistKey = `blacklist:${decoded.userId}:${decoded.iat}`;
  const tokenIsInBlacklist = await redisClient.get(blacklistKey);

  if (tokenIsInBlacklist === token)
    return next(new AppError("Unauthorized, invalid token"), 401);

  req.tokenExp = decoded.exp;
  req.user = user;
  next();
});
