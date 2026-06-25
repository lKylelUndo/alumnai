import {
  AcceptCollaborationService,
  DeclineCollaborationService,
  ViewAllCollaborationInvitesService,
  SendCollaborationInviteService,
  EndCollaborationService,
} from "@/services/collaboration";
import { Request, Response } from "express";

class CollaborationController {
  public acceptCollaboration = async (req: Request, res: Response) => {
    const { collaborationId } = req.body ?? {};
    const response = await AcceptCollaborationService(collaborationId)
    return res.status(response.code).json(response);
  };

  public declineCollaboration = async (req: Request, res: Response) => {
    const { collaborationId } = req.body ?? {};
    const response = await DeclineCollaborationService(collaborationId);
    return res.status(response.code).json(response);
  };

  public viewAllCollaborationInvites = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const response = await ViewAllCollaborationInvitesService(userId);
    return res.status(response.code).json(response);
  };

  public sendCollaborationInvite = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { toStudentId, message_details } = req.body ?? {};
    const response = await SendCollaborationInviteService(userId, { toStudentId, message_details });
    return res.status(response.code).json(response);
  };

  public endCollaboration = async (req: Request, res: Response) => {
    const { collaborationId } = req.body ?? {};
    const response = await EndCollaborationService(collaborationId);
    return res.status(response.code).json(response);
  }
}

export default new CollaborationController();
