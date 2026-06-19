import { MentorshipService } from "@/services/mentorship/mentorship.service";
import { Request, Response } from "express";

class MentorshipController {
  private mentorshipService = new MentorshipService();

  public acceptMentorship = async (req: Request, res: Response) => {
    const { mentorshipId } = req.body ?? {};
    const response = await this.mentorshipService.acceptMentorship(mentorshipId)
    return res.status(response.code).json(response);
  };

  public declineMentorship = async (req: Request, res: Response) => {
    const { mentorshipId } = req.body ?? {};
    const response = await this.mentorshipService.declineMentorship(mentorshipId)
    return res.status(response.code).json(response);
  };

  public viewAllMentorshipInvites = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const response = await this.mentorshipService.viewAllMentorshipInvites(userId);
    return res.status(response.code).json(response);
  };

  public sendMentorshipInvite = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { toAlumniId, message_details } = req.body ?? {};
    const response = await this.mentorshipService.sendMentorshipInvite(userId, { toAlumniId, message_details } );
    return res.status(response.code).json(response);
  };

  public endMentorship = async (req: Request, res: Response) => {
    const { mentorshipId } = req.body ?? {};
    const response = await this.mentorshipService.endMentorship(mentorshipId);
    return res.status(response.code).json(response);
  };
}

export default new MentorshipController();
