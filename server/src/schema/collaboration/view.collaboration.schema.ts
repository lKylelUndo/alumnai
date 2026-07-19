import { z } from "zod";

export const viewAllCollabInviteSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User id is required"),
  }),
});
