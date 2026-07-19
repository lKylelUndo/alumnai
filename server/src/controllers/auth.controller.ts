import type { Request, Response } from "express";
import {
  AuthSignupService,
  AuthLoginService,
  AuthForgetPasswordRequestService,
  AuthResetPasswordService,
  AuthVerifyResetPasswordTokenService,
  GetMeService,
  RefreshTokenService,
} from "@/services/auth";
import { ENV } from "@/config/env";
import { ms } from "@/lib/jwt";

class AuthController {
  private setAuthCookies = async (res: Response, tokens: { accessToken: string, refreshToken: string}) => {
    const isProduction = ENV.NODE_ENV === "production";
    const domain = isProduction ? "/" : undefined;

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: ms(15, "minutes")
    })

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: ms(7, "days")
    })
  }

  public signup = async (req: Request, res: Response) => {
    const { studentIdNumber, email, password } = req.body ?? {};
    const response = await AuthSignupService({studentIdNumber, email, password})
    return res.status(response.code).json(response);
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const response = await AuthLoginService({email, password});

    if (response.code === 200 && response.data?.tokens)
      this.setAuthCookies(res, response.data.tokens)

    return res.status(response.code).json(response);
  };

  public logout = async (req: Request, res: Response) => {
    const isProduction = ENV.NODE_ENV === "production";
    const domain = isProduction ? ".cloomero.cloud" : undefined;

    res.clearCookie("accessToken", { domain });
    res.clearCookie("refreshToken", { domain });

    return res.status(200).json({ code: 200, status: "success", message: "Logged out successfully" });
  };

  public forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body ?? {};
    const response = await AuthForgetPasswordRequestService({email});
    return res.status(response.code).json(response);
  }

  public resetPassword = async (req: Request, res: Response) => {
    const { newPassword, token, userId } = req.body ?? {};
    const response = await AuthResetPasswordService({newPassword, token, userId})
    return res.status(response.code).json(response);
  }

  public verifyResetPasswordToken = async (req: Request, res: Response) => {
    const { token } = req.body ?? {};
    const response = await AuthVerifyResetPasswordTokenService({token})
    return res.status(response.code).json(response);
  }

  public refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;
    const response = await RefreshTokenService(refreshToken)

    if (response.code === 200 && response.data?.tokens)
      this.setAuthCookies(res, response.data.tokens)

    return res.status(response.code).json(response);
  }

  // Get Current User Session
  public me = async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const result = await GetMeService(userId);
    return res.status(result.code).json(result);
  };
}

export default new AuthController();
