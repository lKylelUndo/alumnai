import aiController from "@/controllers/ai.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { aiRateLimiter } from "@/middlewares/rateLimiter";
import { Router } from "express";

const router = Router();

// Authenticated + per-user rate limited: each call spends Gemini budget.
router.post("/v1/find-collaborators", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), aiRateLimiter, aiController.smartSearch)

export default router;