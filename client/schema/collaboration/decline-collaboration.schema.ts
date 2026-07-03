import { z } from "zod";

export const declineCollaborationInviteSchema = z.object({
  collaborationId: z.string().min(1, "Collaboration id is required"),
});

export type DeclineCollaborationInviteInput = z.infer<typeof declineCollaborationInviteSchema>;
