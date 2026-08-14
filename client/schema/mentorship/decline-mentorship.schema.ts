import { z } from "zod";

export const declineMentorshipInviteSchema = z.object({
  mentorshipRecordId: z.string().min(1, "Mentorship id is required"),
});

export type DeclineMentorshipInviteInput = z.infer<typeof declineMentorshipInviteSchema>;
