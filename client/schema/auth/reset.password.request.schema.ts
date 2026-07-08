import { z } from "zod";

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
