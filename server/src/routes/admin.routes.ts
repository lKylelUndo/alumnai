import adminController from "@/controllers/admin.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { approveAlumniRequestSchema, rejectAlumniRequestSchema, rejectUserSchema, suspendUserSchema, verifyUserSchema } from "@/schema/admin";

import { Router } from "express";

const router = Router();

router.get("/v1/get-unverified-users", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getUnverifiedUsers)
router.post("/v1/verify-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(verifyUserSchema), adminController.verifyUser)
router.delete("/v1/reject-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(rejectUserSchema), adminController.rejectUser)
router.put("/v1/suspend-a-user", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(suspendUserSchema), adminController.suspendUser)
router.get("/v1/get-top-mentors", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getTopMentors)
router.get("/v1/get-alumni-request", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getAlumniRequests)
router.put("/v1/approve-alumni-request", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(approveAlumniRequestSchema), adminController.approveAlumniRequest)
router.put("/v1/reject-alumni-request", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(rejectAlumniRequestSchema), adminController.rejectAlumniRequest)
router.get("/v1/get-user-management", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getAllUsers)
router.get("/v1/get-analytics", authMiddleware.execute, permittedRole([RoleType.ADMIN]), adminController.getSkillAnalytics)

export default router;