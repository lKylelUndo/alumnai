import adminController from "@/controllers/admin.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { verifyUserSchema } from "@/schema/admin";
import { Router } from "express";

const router = Router();

router.post("/v1/verify-a-user", validateSchema(verifyUserSchema), adminController.verifyUser)

export default router;