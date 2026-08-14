import { AcceptMentorshipService, DeclineMentorshipService, ViewAllMentorshipInvitesService, SendMentorshipInviteService, EndMentorshipService } from "@/services/mentorship";
import { GetMyMenteesService, GetMentorshipRequestsService } from "@/services/alumni";
import { Request, Response } from "express";

class MentorshipController {
  public acceptMentorship = async (req: Request, res: Response) => {
    const { mentorshipRecordId } = req.body ?? {};
    const response = await AcceptMentorshipService(mentorshipRecordId)
    return res.status(response.code).json(response);
  };

  public declineMentorship = async (req: Request, res: Response) => {
    const { mentorshipRecordId } = req.body ?? {};
    const response = await DeclineMentorshipService(mentorshipRecordId)
    return res.status(response.code).json(response);
  };

  public viewAllMentorshipInvites = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const response = await ViewAllMentorshipInvitesService(userId);
    return res.status(response.code).json(response);
  };

  public sendMentorshipInvite = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { toAlumniId, message_details } = req.body ?? {};
    const response = await SendMentorshipInviteService(userId, { toAlumniId, message_details } );
    return res.status(response.code).json(response);
  };

  public endMentorship = async (req: Request, res: Response) => {
    const { mentorshipRecordId } = req.body ?? {};
    const response = await EndMentorshipService(mentorshipRecordId);
    return res.status(response.code).json(response);
  };

  public getMyMentees = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetMyMenteesService(userId);
    return res.status(response.code).json(response);
  };

  public getMentorshipRequests = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetMentorshipRequestsService(userId);
    return res.status(response.code).json(response);
  };
}

export default new MentorshipController();

