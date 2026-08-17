import alumniController from "@/controllers/alumni.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { requestAlumniUpgradeSchema } from "@/schema/alumni";

import { Router } from "express";

const router = Router();

router.post("/v1/request-alumni-upgrade", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(requestAlumniUpgradeSchema), alumniController.requestAlumniUpgrade);
router.get("/v1/get-dashboard-stats", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), alumniController.getDashboardStats);
router.get("/v1/find-collaborators", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), alumniController.findCollaborators);
router.get("/v1/get-my-collaborations", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), alumniController.getMyCollaborations);

export default router;