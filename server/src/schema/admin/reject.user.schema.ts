import { z } from "zod";

export const rejectUserSchema = z.object({
    body: z.object({
        id: z.string().min(1, "User id is required"),
    }),
});

export type RejectUserSchemaTypes = z.infer<typeof rejectUserSchema>;