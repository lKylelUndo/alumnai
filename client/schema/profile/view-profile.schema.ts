import { z } from "zod";

export const viewProfileSchema = z.object({
  id: z.string().min(1, "User id is required"),
});

export type ViewProfileInput = z.infer<typeof viewProfileSchema>;
