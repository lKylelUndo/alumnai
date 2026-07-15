import { z } from "zod";

export const verifyUserSchema = z.object({
  id: z.string().min(1, "User id is required"),
});

export type VerifyUserInput = z.infer<typeof verifyUserSchema>;
