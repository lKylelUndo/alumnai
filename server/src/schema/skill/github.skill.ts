import { z } from "zod";

export const githubSkillIndexSchema = z.object({
    body: z.object({
        githubURL: z.string().url().min(1, "Github URL is required"),
    }),
});

export type GithubSkillIndexInputTypes = z.infer<typeof githubSkillIndexSchema>;