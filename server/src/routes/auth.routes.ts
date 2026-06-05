import authController from "@/controllers/auth.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { loginSchema, signUpSchema } from "@/schema/auth";
import { Router } from "express";

const router = Router();

router.post("/v1/signup", validateSchema(signUpSchema), authController.signup);
router.post("/v1/login", validateSchema(loginSchema), authController.login);
router.post("/v1/logout", authController.logout);

export default router;