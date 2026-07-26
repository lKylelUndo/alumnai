import { VerifyUserService, GetUnverifiedUsersService, GetTopMentorsService, GetAlumniRequestsService, GetAllUsersService, GetSkillAnalyticsService, SuspendUserService, ActivateUserService, RejectUserService, ApproveAlumniRequestService, RejectAlumniRequestService } from "@/services/admin";
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

  public suspendUser = async (req: Request, res: Response) => {
    const { id } = req.body ?? {};
    const response = await SuspendUserService(id);
    return res.status(response.code).json(response);
  };

  public activateUser = async (req: Request, res: Response) => {
    const { id } = req.body ?? {};
    const response = await ActivateUserService(id);
    return res.status(response.code).json(response);
  };

  public rejectUser = async (req: Request, res: Response) => {
    const { id } = req.body ?? {};
    const response = await RejectUserService(id);
    return res.status(response.code).json(response);
  };

  public approveAlumniRequest = async (req: Request, res: Response) => {
    const { studentId } = req.body ?? {};
    const response = await ApproveAlumniRequestService(studentId);
    return res.status(response.code).json(response);
  };

  public rejectAlumniRequest = async (req: Request, res: Response) => {
    const { studentId } = req.body ?? {};
    const response = await RejectAlumniRequestService(studentId);
    return res.status(response.code).json(response);
  };
}

export default new AdminController();


