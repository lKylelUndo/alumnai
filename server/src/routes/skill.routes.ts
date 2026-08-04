import skillController from "@/controllers/skill.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { addSkillSchema, githubSkillIndexSchema, removeSkillSchema } from "@/schema/skill";
import { Router } from "express";

const router = Router();

router.post("/v1/add-skill", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(addSkillSchema), skillController.add);
router.post("/v1/remove-skill", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(removeSkillSchema), skillController.remove);
router.get("/v1/get-top-alumni-skills", authMiddleware.execute, permittedRole([RoleType.ADMIN]), skillController.getTopAlumniSkills);

// Production Github Skill Index
//router.post("/v1/github-skill-index", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(githubSkillIndexSchema), skillController.githubSkillIndex);

// Development Github Skill Index
router.post("/v1/github-skill-index", validateSchema(githubSkillIndexSchema), skillController.githubSkillIndex);

export default router;
