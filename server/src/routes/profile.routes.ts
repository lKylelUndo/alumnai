import { json } from "express";
import profileController from "@/controllers/profile.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { updateProfileSchema, viewProfileSchema, certificationIdParamSchema, setCertificationVisibilitySchema } from "@/schema/profile";
import { Router } from "express";

const router = Router();

router.post("/v1/view-single-profile", authMiddleware.execute, validateSchema(viewProfileSchema), profileController.viewProfile);
router.get("/v1/all-profiles", authMiddleware.execute, profileController.allProfiles);
router.post("/v1/update-profile", json({ limit: "15mb" }), authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(updateProfileSchema), profileController.updateProfile);
router.patch("/v1/certifications/:id/visibility", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(setCertificationVisibilitySchema), profileController.setCertificationVisibility);
router.delete("/v1/certifications/:id", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(certificationIdParamSchema), profileController.deleteCertification);

export default router;