import { z } from "zod";

export const forgetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type ForgetPasswordRequestInput = z.infer<typeof forgetPasswordRequestSchema>;
