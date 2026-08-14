import { AcceptMentorshipRequestService, DeclineMentorshipRequestService, FindRandomCollaboratorsService, GetAlumniDashboardStatsService, GetMentorshipRequestsService, GetMyCollaborationsService, GetMyMenteesService, RequestAlumniUpgradeService } from "@/services/alumni";
import type { Request, Response } from "express";

class AlumniController {
  public requestAlumniUpgrade = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { documentUrl } = req.body ?? {};
    const response = await RequestAlumniUpgradeService(userId, documentUrl);
    return res.status(response.code).json(response);
  };

  public getDashboardStats = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetAlumniDashboardStatsService(userId);
    return res.status(response.code).json(response);
  };

  public findCollaborators = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await FindRandomCollaboratorsService(userId);
    return res.status(response.code).json(response);
  };

  public getMyMentees = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetMyMenteesService(userId);
    return res.status(response.code).json(response);
  };

  public getMyCollaborations = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetMyCollaborationsService(userId);
    return res.status(response.code).json(response);
  };

  public getMentorshipRequests = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const response = await GetMentorshipRequestsService(userId);
    return res.status(response.code).json(response);
  };
  //   const userId = req.user!.userId;
  //   const { mentorshipRecordId } = req.body ?? {};
  //   const response = await DeclineMentorshipRequestService(userId, mentorshipRecordId);
  //   return res.status(response.code).json(response);
  // };
}

export default new AlumniController();
