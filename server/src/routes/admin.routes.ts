import adminController from "@/controllers/admin.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { activateUserSchema, rejectUserSchema, suspendUserSchema, verifyUserSchema } from "@/schema/admin";

import { Router } from "express";

const router = Router();

router.get("/v1/get-unverified-users", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getUnverifiedUsers);
router.post("/v1/verify-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(verifyUserSchema), adminController.verifyUser);
router.delete("/v1/reject-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(rejectUserSchema), adminController.rejectUser);
router.put("/v1/suspend-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(suspendUserSchema), adminController.suspendUser);
router.put("/v1/activate-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(activateUserSchema), adminController.activateUser);
router.get("/v1/get-all-users", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getAllUsers);
router.get("/v1/get-stats", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getDashboardStats);

export default router;





