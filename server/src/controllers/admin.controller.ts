import { VerifyUserService, GetUnverifiedUsersService } from "@/services/admin";
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

  public suspendUser = async () => {};
}

export default new AdminController();
