import alumniController from "@/controllers/alumni.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { requestAlumniUpgradeSchema } from "@/schema/alumni";

import { Router } from "express";

const router = Router();

router.post("/v1/request-alumni-upgrade", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(requestAlumniUpgradeSchema), alumniController.requestAlumniUpgrade);

export default router;