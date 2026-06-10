import profileController from "@/controllers/profile.controller";
import { Router } from "express";

const router = Router();

router.get("/v1/view-single-profile", profileController.viewProfile);
router.get("/v1/all-profiles", profileController.allProfiles);
router.post("/v1/update-profile", profileController.updateProfile);

export default router;