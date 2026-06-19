import { z } from "zod";

export const declineCollaborationInviteSchema = z.object({
  body: z.object({
    collaborationId: z.string().min(1, "Collaboration id is required"),
  }),
});

export type DeclineCollaborationInviteInputTypes = z.infer<typeof declineCollaborationInviteSchema>["body"];