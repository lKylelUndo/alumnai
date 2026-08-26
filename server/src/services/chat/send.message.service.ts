import { ChatRepository } from "@/repositories/chat.repository";
import { SendMessageInputTypes } from "@/schema/chat";
import { notifyUser } from "@/lib/socket";

export const SendMessageService = async (senderId: string, data: SendMessageInputTypes) => {
  const chatRepository = new ChatRepository();

  try {
    if (!senderId) {
      return { status: "error", code: 400, message: "Sender ID is required" };
    }

    const result = await chatRepository.sendMessage(data.conversationId, senderId, data.content.trim());

    if (!result) {
      return {
        status: "error",
        code: 403,
        message: "Unable to send message: active mentorship or collaboration required",
      };
    }

    // Real-time notify the recipient of the new message
    notifyUser(result.recipientId, "chat:new_message", {
      conversationId: data.conversationId,
      message: result.message,
    });

    return {
      status: "success",
      code: 201,
      message: "Message sent successfully",
      data: { message: result.message },
    };
  } catch (error) {
    console.error("SendMessageService", error);
    return { status: "error", code: 500, message: "Unable to send message" };
  }
};
