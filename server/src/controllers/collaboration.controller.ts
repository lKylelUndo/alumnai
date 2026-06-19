import { CollaborationService } from "@/services/collaboration/collaboration.service";
import { Request, Response } from "express";

class CollaborationController {
  private collaborationService = new CollaborationService();

  public acceptCollaboration = async (req: Request, res: Response) => {
    //const { userId } = req.user!
    const { collaborationId } = req.body ?? {};
    const response = await this.collaborationService.acceptCollaboration(collaborationId)
    return res.status(response.code).json(response);
  };

  public declineCollaboration = async (req: Request, res: Response) => {
    const { collaborationId } = req.body ?? {};
    const response = await this.collaborationService.declineCollaboration(collaborationId);
    return res.status(response.code).json(response);
  };

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

  public endCollaboration = async (req: Request, res: Response) => {
    const { collaborationId } = req.body ?? {};
    const response = await this.collaborationService.endCollaboration(collaborationId);
    return res.status(response.code).json(response);
  }
}

export default new CollaborationController();
