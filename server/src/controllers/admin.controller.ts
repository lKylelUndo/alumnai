import {
  VerifyUserService,
  GetUnverifiedUsersService,
  GetTopMentorsService,
  GetAlumniRequestsService,
  GetAllUsersService,
  GetSkillAnalyticsService,
} from "@/services/admin";
import type { Request, Response } from "express";

class AdminController {
  public getUnverifiedUsers = async (req: Request, res: Response) => {
    const response = await GetUnverifiedUsersService();
    return res.status(response.code).json(response);
  };

  public verifyUser = async (req: Request, res: Response) => {
    const { id } = req.body ?? {};
    const response = await VerifyUserService(id);
    return res.status(response.code).json(response);
  };

  public getTopMentors = async (req: Request, res: Response) => {
    const response = await GetTopMentorsService();
    return res.status(response.code).json(response);
  };

  public getAlumniRequests = async (req: Request, res: Response) => {
    const response = await GetAlumniRequestsService();
    return res.status(response.code).json(response);
  };

  public getAllUsers = async (req: Request, res: Response) => {
    const response = await GetAllUsersService();
    return res.status(response.code).json(response);
  };

  public getSkillAnalytics = async (req: Request, res: Response) => {
    const response = await GetSkillAnalyticsService();
    return res.status(response.code).json(response);
  };

  public suspendUser = async () => {};
}

export default new AdminController();
