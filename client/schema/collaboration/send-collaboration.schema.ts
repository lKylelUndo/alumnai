import { z } from "zod";

export const sendCollaborationInviteSchema = z.object({
  toStudentId: z.string().min(1, "Student id is required"),
  message_details: z.string().min(1, "Message is required").max(1000, "Message cannot exceed 1000 characters"),
});

export type SendCollaborationInviteInput = z.infer<typeof sendCollaborationInviteSchema>;
