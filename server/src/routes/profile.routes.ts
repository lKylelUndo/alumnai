import profileController from "@/controllers/profile.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { updateProfileSchema, viewProfileSchema } from "@/schema/profile";
import { Router } from "express";

const router = Router();

router.post("/v1/view-single-profile", authMiddleware.execute, validateSchema(viewProfileSchema), profileController.viewProfile);
router.get("/v1/all-profiles", authMiddleware.execute, profileController.allProfiles);
router.post("/v1/update-profile", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(updateProfileSchema), profileController.updateProfile);

export default router;