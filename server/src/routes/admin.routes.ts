import adminController from "@/controllers/admin.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { verifyUserSchema } from "@/schema/admin";
import { Router } from "express";

const router = Router();

router.get("/v1/get-unverified-users", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getUnverifiedUsers)
router.post("/v1/verify-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(verifyUserSchema), adminController.verifyUser)

export default router;