import aiController from "@/controllers/ai.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Router } from "express";

const router = Router();

// router.post("/v1/find-collaborators", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), aiController.smartSearch)

// Development
router.post("/v1/find-collaborators", aiController.smartSearch)

export default router;