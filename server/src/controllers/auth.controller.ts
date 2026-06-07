import type { Request, Response } from "express";
import { AuthService } from "@/services/auth/auth.service";
import { ENV } from "@/config/env";
import { ms } from "@/lib/jwt";

class AuthController {
  private authService = new AuthService();

  private setAuthCookies = async (res: Response, tokens: { accessToken: string, refreshToken: string}) => {
    const isProduction = ENV.NODE_ENV === "production";
    const domain = isProduction ? "" : undefined;

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction, // right now its false cuz its development era
      sameSite: isProduction ? "none" : "lax",
      maxAge: ms(15, "minutes")
    })
  }

  public signup = async (req: Request, res: Response) => {
    const { studentIdNumber, email, password } = req.body ?? {};
    const response = await this.authService.signup({studentIdNumber, email, password})
    return res.status(response.code).json(response);
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const response = await this.authService.login({email, password});

    if (response.code === 200 && response.data?.tokens)
      this.setAuthCookies(res, response.data.tokens)

    return res.status(response.code).json(response);
  };

  public logout = async (req: Request, res: Response) => {
    res.json("logout");
  };
}

export default new AuthController();