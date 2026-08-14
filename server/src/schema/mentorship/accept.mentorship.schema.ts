import { z } from "zod";

export const acceptMentorshipInviteSchema = z.object({
  body: z.object({
    mentorshipRecordId: z.string().min(1, "Mentorship id is required"),
  }),
});

export type AcceptMentorshipInviteTypes = z.infer<typeof acceptMentorshipInviteSchema>["body"];