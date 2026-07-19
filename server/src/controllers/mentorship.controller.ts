import {
  AcceptMentorshipService,
  DeclineMentorshipService,
  ViewAllMentorshipInvitesService,
  SendMentorshipInviteService,
  EndMentorshipService,
} from "@/services/mentorship";
import { Request, Response } from "express";

class MentorshipController {
  public acceptMentorship = async (req: Request, res: Response) => {
    const { mentorshipId } = req.body ?? {};
    const response = await AcceptMentorshipService(mentorshipId)
    return res.status(response.code).json(response);
  };

  public declineMentorship = async (req: Request, res: Response) => {
    const { mentorshipId } = req.body ?? {};
    const response = await DeclineMentorshipService(mentorshipId)
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
    const { mentorshipId } = req.body ?? {};
    const response = await EndMentorshipService(mentorshipId);
    return res.status(response.code).json(response);
  };
}

export default new MentorshipController();
