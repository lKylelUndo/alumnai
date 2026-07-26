import { z } from "zod";

export const activateUserSchema = z.object({
  body: z.object({
    id: z.string().min(1, "User id is required"),
  }),
});

export type ActivateUserSchemaTypes = z.infer<typeof activateUserSchema>;
