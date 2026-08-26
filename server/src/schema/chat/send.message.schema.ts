import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().uuid("Invalid conversation ID"),
    content: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message is too long"),
  }),
});

export type SendMessageInputTypes = z.infer<typeof sendMessageSchema>["body"];
