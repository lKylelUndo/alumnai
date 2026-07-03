import { z } from "zod";

export const sendMentorshipInviteSchema = z.object({
  toAlumniId: z.string().min(1, "Alumni id is required"),
  message_details: z.string().min(1, "Message is required").max(1000, "Message cannot exceed 1000 characters"),
});

export type SendMentorshipInviteInput = z.infer<typeof sendMentorshipInviteSchema>;
