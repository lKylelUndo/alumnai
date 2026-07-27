import { z } from "zod";

export const verifyUserSchema = z.object({
  body: z.object({
    id: z.string().min(1, "User id is required"),
  }),
});

export type VerifyUserSchemaTypes = z.infer<typeof verifyUserSchema>;
