import mentorController from "@/controllers/mentor.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { Router } from "express";

const router = Router();

router.get("/v1/get-top-mentors", authMiddleware.execute, permittedRole([RoleType.ADMIN]), mentorController.getTopMentors);

export default router;
