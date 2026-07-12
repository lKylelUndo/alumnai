import authController from "@/controllers/auth.controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { loginRateLimiter } from "@/middlewares/rateLimiter";
import { validateSchema } from "@/middlewares/validate-schema";
import { forgetPasswordRequestSchema, loginSchema, refreshTokenSchema, resetPasswordSchema, signUpSchema, verifyResetPasswordTokenSchema } from "@/schema/auth";
import { Router } from "express";

const router = Router();

router.post("/v1/signup", validateSchema(signUpSchema), authController.signup);
router.post("/v1/login", validateSchema(loginSchema), loginRateLimiter, authController.login);
router.post("/v1/logout", authMiddleware.execute, authController.logout);

// Request link for forget password
router.post("/v1/forget-password", validateSchema(forgetPasswordRequestSchema), authController.forgetPassword),
router.post("/v1/reset-password", validateSchema(resetPasswordSchema), authController.resetPassword);
router.post("/v1/verify-reset-password-token", validateSchema(verifyResetPasswordTokenSchema), authController.verifyResetPasswordToken)

router.post("/v1/refresh-token", validateSchema(refreshTokenSchema), authController.refreshToken)

// Get Current User Session
router.get("/v1/me", authMiddleware.execute, authController.me);

export default router;