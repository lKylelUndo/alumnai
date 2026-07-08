import { z } from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type ResetPasswordRequestInputTypes = z.infer<typeof resetPasswordRequestSchema>;
