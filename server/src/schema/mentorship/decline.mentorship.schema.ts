import { z } from "zod";

export const declineMentorshipInviteSchema = z.object({
  body: z.object({
    mentorshipRecordId: z.string().min(1, "Mentorship id is required"),
  }),
});