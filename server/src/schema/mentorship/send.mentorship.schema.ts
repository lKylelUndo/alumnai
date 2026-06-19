import { z } from "zod";

export const sendMentorshipInviteSchema = z.object({
  body: z.object({
    toAlumniId: z.string().min(1, "Alumni id is required"),
    message_details: z.string().min(1, "Message is reuqired").max(1000),
  }),
});

export type SendMentorshipInviteTypes = z.infer<typeof sendMentorshipInviteSchema>["body"];