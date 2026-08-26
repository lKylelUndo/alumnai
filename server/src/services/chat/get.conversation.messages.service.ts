import { ChatRepository } from "@/repositories/chat.repository";

export const GetConversationMessagesService = async (conversationId: string, userId: string) => {
  const chatRepository = new ChatRepository();

  try {
    if (!conversationId) {
      return { status: "error", code: 400, message: "Conversation ID is required" };
    }

    const messages = await chatRepository.getConversationMessages(conversationId, userId);

    if (messages === null) {
      return {
        status: "error",
        code: 403,
        message: "You are not authorized to view this conversation or the relationship is not active",
      };
    }

    return {
      status: "success",
      code: 200,
      message: "Fetched conversation messages successfully",
      data: { messages },
    };
  } catch (error) {
    console.error("GetConversationMessagesService", error);
    return { status: "error", code: 500, message: "Unable to fetch messages" };
  }
};
