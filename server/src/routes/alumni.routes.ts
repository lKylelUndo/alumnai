import alumniController from "@/controllers/alumni.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { approveAlumniRequestSchema, rejectAlumniRequestSchema, requestAlumniUpgradeSchema } from "@/schema/alumni";

import { Router } from "express";

const router = Router();

router.get("/v1/get-alumni-request", authMiddleware.execute, permittedRole([RoleType.ADMIN]), alumniController.getAlumniRequests)
router.put("/v1/approve-alumni-request", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(approveAlumniRequestSchema), alumniController.approveAlumniRequest)
router.put("/v1/reject-alumni-request", authMiddleware.execute, permittedRole([RoleType.ADMIN]), validateSchema(rejectAlumniRequestSchema), alumniController.rejectAlumniRequest)
router.post("/v1/request-alumni-upgrade", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(requestAlumniUpgradeSchema), alumniController.requestAlumniUpgrade)

export default router;

