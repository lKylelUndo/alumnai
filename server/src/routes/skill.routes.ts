import skillController from "@/controllers/skill.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { addSkillSchema, removeSkillSchema } from "@/schema/skill";
import { Router } from "express";

const router = Router();

router.post("/v1/add-skill", validateSchema(addSkillSchema), skillController.add);
router.post("/v1/remove-skill", validateSchema(removeSkillSchema), skillController.remove);

export default router;