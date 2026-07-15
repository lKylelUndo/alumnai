import { z } from "zod";

export const removeSkillSchema = z.object({
  id: z.string().min(1, "Skill id is required"),
});

export type RemoveSkillInput = z.infer<typeof removeSkillSchema>;
