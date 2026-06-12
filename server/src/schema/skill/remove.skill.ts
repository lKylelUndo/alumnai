import { z } from "zod";

export const removeSkillSchema = z.object({
    body: z.object({
        id: z.string().min(1, "Skill is is required")
    })
});