import { GetUserConversationsService, GetConversationMessagesService, SendMessageService } from "@/services/chat";
import { Request, Response } from "express";

class ChatController {
  public getUserConversations = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const response = await GetUserConversationsService(userId);
    return res.status(response.code).json(response);
  };

  public getConversationMessages = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { conversationId } = req.params;
    const response = await GetConversationMessagesService(conversationId, userId);
    return res.status(response.code).json(response);
  };

  public sendMessage = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { conversationId, content } = req.body ?? {};
    const response = await SendMessageService(userId, { conversationId, content });
    return res.status(response.code).json(response);
  };
}

export default new ChatController();
