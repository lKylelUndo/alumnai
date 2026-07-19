import { z } from "zod";

export const acceptCollaborationInviteSchema = z.object({
  collaborationId: z.string().min(1, "Collaboration id is required"),
});

export type AcceptCollaborationInviteInput = z.infer<typeof acceptCollaborationInviteSchema>;
