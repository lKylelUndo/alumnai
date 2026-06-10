import profileController from "@/controllers/profile.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { viewProfileSchema } from "@/schema/profile";
import { Router } from "express";

const router = Router();

router.post("/v1/view-single-profile", validateSchema(viewProfileSchema), profileController.viewProfile);
router.get("/v1/all-profiles", profileController.allProfiles);
router.post("/v1/update-profile", profileController.updateProfile);

export default router;