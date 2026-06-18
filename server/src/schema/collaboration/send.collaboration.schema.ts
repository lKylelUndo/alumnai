import { z } from "zod";

export const sendCollaborationInviteSchema = z.object({
  body: z.object({
    toStudentId: z.string().min(1, "Student id is required"),
    message_details: z.string().min(1, "Message is required").max(1000),
  }),
});

export type SendCollaborationInviteInputTypes = z.infer<typeof sendCollaborationInviteSchema>["body"];