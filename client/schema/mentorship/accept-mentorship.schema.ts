import { z } from "zod";

export const acceptMentorshipInviteSchema = z.object({
  mentorshipId: z.string().min(1, "Mentorship id is required"),
});

export type AcceptMentorshipInviteInput = z.infer<typeof acceptMentorshipInviteSchema>;
