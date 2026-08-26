import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID"),
  content: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message is too long"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export interface ChatUser {
  id: string;
  fullName: string;
  profilePicture: string | null;
  role: "STUDENT" | "ALUMNI" | "ADMIN";
  workField?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    fullName: string;
    profilePicture: string | null;
    role: string;
  };
}

export interface Conversation {
  id: string;
  type: "MENTORSHIP" | "COLLABORATION";
  relationshipId: string;
  otherUser: ChatUser;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  updatedAt: string;
}
