import skillController from "@/controllers/skill.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { addSkillSchema, removeSkillSchema } from "@/schema/skill";
import { Router } from "express";

const router = Router();

router.post("/v1/add-skill", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(addSkillSchema), skillController.add);
router.post("/v1/remove-skill", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(removeSkillSchema), skillController.remove);

export default router;