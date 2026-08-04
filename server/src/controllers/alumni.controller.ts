import { GetAlumniRequestsService, ApproveAlumniRequestService, RejectAlumniRequestService, RequestAlumniUpgradeService } from "@/services/alumni";
import type { Request, Response } from "express";

class AlumniController {
  public getAlumniRequests = async (req: Request, res: Response) => {
    const response = await GetAlumniRequestsService();
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

  public requestAlumniUpgrade = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { documentUrl } = req.body ?? {};
    const response = await RequestAlumniUpgradeService(userId, documentUrl);
    return res.status(response.code).json(response);
  };
}

export default new AlumniController();

