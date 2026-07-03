import { z } from "zod";

export const verifyResetPasswordTokenSchema = z.object({
  token: z.string().min(1, "Reset password token is required"),
});

export type VerifyResetPasswordTokenInput = z.infer<typeof verifyResetPasswordTokenSchema>;
