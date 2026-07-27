import { z } from "zod";

export const suspendUserSchema = z.object({
  body: z.object({
    id: z.string().min(1, "User id is required"),
  }),
});

export type SuspendUserSchemaTypes = z.infer<typeof suspendUserSchema>;