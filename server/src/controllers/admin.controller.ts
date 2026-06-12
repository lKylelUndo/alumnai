import { AdminService } from "@/services/admin/admin.service";
import type { Request, Response } from "express";

class AdminController {
  private adminService = new AdminService();

  public verifyUser = async (req: Request, res: Response) => {
    const { id } = req.body ?? {};
    const response = await this.adminService.verify(id);
    return res.status(response.code).json(response);
  };

  public suspendUser = async () => {};
}

export default new AdminController();