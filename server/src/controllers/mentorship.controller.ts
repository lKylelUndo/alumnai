import { AcceptMentorshipService, DeclineMentorshipService, ViewAllMentorshipInvitesService, SendMentorshipInviteService, EndMentorshipService, GetMyMentorsService, GetStudentMentorsService, RecognizeAlumniService, GetMentorRecognitionService, SetRecognitionVisibilityService } from "@/services/mentorship";
import { GetMyMenteesService, GetMentorshipRequestsService } from "@/services/alumni";
import { SetRecognitionVisibilityTypes } from "@/schema/mentorship";
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

  public getStudentMentors = async (req: Request, res: Response) => {
    // Viewer-safe: the student id comes from the URL so any authenticated
    // viewer (alumni, student, admin) can see a student's ACTIVE mentors.
    const { studentId } = req.params;
    if (typeof studentId !== "string") {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Student id is required", data: [] });
    }
    const response = await GetStudentMentorsService(studentId);
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

  public setRecognitionVisibility = async (req: Request, res: Response) => {
    // Only the alumni who received the recognition may change its visibility.
    const { userId: alumniId } = req.user!;
    const { recognitionId } = req.params;
    if (typeof recognitionId !== "string") {
      return res
        .status(400)
        .json({ status: "error", code: 400, message: "Recognition id is required" });
    }
    // Body shape already enforced by setRecognitionVisibilitySchema.
    const { isVisible } = (req.body ?? {}) as SetRecognitionVisibilityTypes;
    const response = await SetRecognitionVisibilityService(recognitionId, alumniId, isVisible);
    return res.status(response.code).json(response);
  };
}

export default new MentorshipController();


