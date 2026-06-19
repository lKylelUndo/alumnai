import adminController from "@/controllers/admin.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { verifyUserSchema } from "@/schema/admin";
import { Router } from "express";

const router = Router();

router.get("/v1/get-unverified-users", adminController.getUnverifiedUsers)
router.post("/v1/verify-a-user", validateSchema(verifyUserSchema), adminController.verifyUser)

export default router;