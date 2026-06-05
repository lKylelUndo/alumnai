import type { Request, Response } from "express";
import { AuthService } from "@/services/auth/auth.service";

class AuthController {
  private authService = new AuthService();

  public signup = async (req: Request, res: Response) => {
    const { studentIdNumber, email, password } = req.body ?? {};
    const response = await this.authService.signup({studentIdNumber, email, password})
    return res.status(response.code).json(response);
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    res.json("login");
  };

  public logout = async (req: Request, res: Response) => {
    res.json("logout");
  };
}

export default new AuthController();