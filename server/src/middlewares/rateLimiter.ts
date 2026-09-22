import { rateLimit } from "express-rate-limit";
import type { Request } from "express";

const isProduction = process.env.NODE_ENV === "production";

const jsonMessage = (message: string) => ({
  code: 429,
  status: "error",
  message,
});

// Backstop for every /api route. Mounted in app.ts before the routers.
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: isProduction ? 300 : 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: jsonMessage("Too many requests. Please slow down and try again later."),
});

// Credential-stuffing / password-spraying defense for login.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: jsonMessage(
    "Too many failed login attempts. Please try again in 15 minutes or reset your password."
  ),
});

// Slows email bombing, reset-token spam, and token-oracle probing.
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: jsonMessage(
    "Too many password reset attempts. Please try again in an hour."
  ),
});

// Refresh carries a long-lived credential — keep it throttled but usable.
export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: jsonMessage("Too many session refresh attempts. Please try again later."),
});

// AI calls cost money per request — key by user so one account can't drain the budget.
// Must be mounted AFTER authMiddleware so req.user is populated.
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.user?.userId ?? req.ip ?? "unknown",
  message: jsonMessage(
    "AI request limit reached. Please try again in an hour."
  ),
});
