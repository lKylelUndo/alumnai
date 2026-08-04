import { VerifyUserService, GetUnverifiedUsersService, GetAllUsersService, SuspendUserService, ActivateUserService, RejectUserService, GetAdminStatsService } from "@/services/admin";
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

  public getAllUsers = async (req: Request, res: Response) => {
    const response = await GetAllUsersService();
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

  public getDashboardStats = async (req: Request, res: Response) => {
    const response = await GetAdminStatsService();
    return res.status(response.code).json(response);
  };
}

export default new AdminController();

