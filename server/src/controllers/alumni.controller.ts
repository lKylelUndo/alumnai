import { FindRandomCollaboratorsService, GetAlumniDashboardStatsService, RequestAlumniUpgradeService } from "@/services/alumni";
import type { Request, Response } from "express";

class AlumniController {
  public requestAlumniUpgrade = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { documentUrl } = req.body ?? {};
    const response = await RequestAlumniUpgradeService(userId, documentUrl);
    return res.status(response.code).json(response);
  };

  public getDashboardStats = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const response = await GetAlumniDashboardStatsService(userId);
    return res.status(response.code).json(response);
  };

  public findCollaborators = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const response = await FindRandomCollaboratorsService(userId);
    return res.status(response.code).json(response);
  };
}

export default new AlumniController();


