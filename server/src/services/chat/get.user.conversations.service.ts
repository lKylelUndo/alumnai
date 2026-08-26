import { ChatRepository } from "@/repositories/chat.repository";

export const GetUserConversationsService = async (userId: string) => {
  const chatRepository = new ChatRepository();

  try {
    if (!userId) {
      return { status: "error", code: 400, message: "User ID is required" };
    }

    const conversations = await chatRepository.getUserConversations(userId);

    return {
      status: "success",
      code: 200,
      message: "Fetched user conversations successfully",
      data: { conversations },
    };
  } catch (error) {
    console.error("GetUserConversationsService", error);
    return { status: "error", code: 500, message: "Unable to fetch conversations" };
  }
};
