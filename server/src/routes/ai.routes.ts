import aiController from "@/controllers/ai.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Router } from "express";

const router = Router();

router.post("/v1/search-students", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), aiController.smartSearch)

export default router;