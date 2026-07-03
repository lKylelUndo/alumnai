import { z } from "zod";

export const addSkillSchema = z.object({
  profileId: z.string().min(1, "Profile id is required"),
  type: z.enum(["SOFT_SKILL", "HARD_SKILL"]),
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
});

export type AddSkillInput = z.infer<typeof addSkillSchema>;
