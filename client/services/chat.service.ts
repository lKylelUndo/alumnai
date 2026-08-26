import { axiosInstance } from "@/lib/axios";
import { SendMessageInput } from "@/schema/chat";

export const chatService = {
  getConversations: async () => {
    const response = await axiosInstance.get("/api/chat/v1/conversations");
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await axiosInstance.get(`/api/chat/v1/messages/${conversationId}`);
    return response.data;
  },

  sendMessage: async (data: SendMessageInput) => {
    const response = await axiosInstance.post("/api/chat/v1/send-message", data);
    return response.data;
  },
};
