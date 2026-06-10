import { z } from "zod";

export const viewProfileSchema = z.object({
    body: z.object({
        id: z.string().min(1, "User id is required")
    })
})