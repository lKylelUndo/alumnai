import { z } from "zod";

export const acceptCollaborationInviteSchema = z.object({
  body: z.object({
    collaborationId: z.string().min(1, "Collaboration id is required"),
  }),
});

export type AcceptCollaborationInviteInputTypes = z.infer<typeof acceptCollaborationInviteSchema>["body"];