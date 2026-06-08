import { rateLimit } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message:
    "Too many failed login attempts. Please try again in 15 minutes or reset your password.",
});