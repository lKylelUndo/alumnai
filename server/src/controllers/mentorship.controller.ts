import { AcceptMentorshipService, DeclineMentorshipService, ViewAllMentorshipInvitesService, SendMentorshipInviteService, EndMentorshipService, GetMyMentorsService, RecognizeAlumniService, GetMentorRecognitionService } from "@/services/mentorship";
import { GetMyMenteesService, GetMentorshipRequestsService } from "@/services/alumni";
import { Request, Response } from "express";

class MentorshipController {
  public acceptMentorship = async (req: Request, res: Response) => {
    const { mentorshipRecordId } = req.body ?? {};
    const { userId: alumniId } = req.user!;
    const response = await AcceptMentorshipService(mentorshipRecordId, alumniId)
    return res.status(response.code).json(response);
  };

  public declineMentorship = async (req: Request, res: Response) => {
    const { mentorshipRecordId } = req.body ?? {};
    const { userId: alumniId } = req.user!;
    const response = await DeclineMentorshipService(mentorshipRecordId, alumniId)
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
    const response = await SendMentorshipInviteService(userId, { toAlumniId, message_details });
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

  public getMyMentors = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetMyMentorsService(userId);
    return res.status(response.code).json(response);
  };

  public recognizeAlumni = async (req: Request, res: Response) => {
    const { userId: studentId } = req.user!;
    const { toAlumniId, message } = req.body ?? {};
    const response = await RecognizeAlumniService(studentId, { toAlumniId, message });
    return res.status(response.code).json(response);
  };

  public getMentorRecognition = async (req: Request, res: Response) => {
    const { userId: studentId } = req.user!;
    const { alumniId } = req.params;
    const response = await GetMentorRecognitionService(studentId, alumniId);
    return res.status(response.code).json(response);
  };
}

export default new MentorshipController();


