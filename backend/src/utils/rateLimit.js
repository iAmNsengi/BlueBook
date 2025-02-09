import rateLimit from "express-rate-limit";

export const loginRequestsLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: {
    success: false,
    message: "Too many login attempts, try again after 15 minutes",
  },
  legacyHeaders: true,
  standardHeaders: true,
});

export const signupRequestsLimiter = rateLimit({
  max: 10,
  windowMs: 10 * 60 * 1000,
  message: {
    success: false,
    message: "Too many signup requests, try again after 10 minutes",
  },
  standardHeaders: true,
  legacyHeaders: true,
});

export const requestsLimit = rateLimit({
  max: 150,
  windowMs: 15 * 60 * 1000,
  message: {
    success: false,
    message: "Too many requests from this IP try again after 15 minutes",
  },
  legacyHeaders: true,
  standardHeaders: true,
});
