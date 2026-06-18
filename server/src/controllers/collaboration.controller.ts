import { CollaborationService } from "@/services/collaboration/collaboration.service";
import { Request, Response } from "express";

class CollaborationController {
  private collaborationService = new CollaborationService();

  public acceptCollaboration = async () => {};

  public declineCollaboration = async () => {};

  public viewAllCollaborationInvites = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const response = await this.collaborationService.viewAllCollaborationInvites(userId);
    return res.status(response.code).json(response);
  };

  public sendCollaborationInvite = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { toStudentId, message_details } = req.body ?? {};
    const response = await this.collaborationService.sendCollaborationInvite(userId, { toStudentId, message_details });
    return res.status(response.code).json(response);
  };
}

export default new CollaborationController();
