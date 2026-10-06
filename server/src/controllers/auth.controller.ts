import type { Request, Response } from "express";
import { AuthSignupService, AuthLoginService, AuthForgetPasswordRequestService, AuthResetPasswordService, AuthVerifyResetPasswordTokenService, GetMeService, RefreshTokenService } from "@/services/auth";
import { TokenRepository } from "@/repositories/token.repository";
import { ENV } from "@/config/env";
import { ms } from "@/lib/jwt";

class AuthController {
  // Single source of truth for cookie attributes — set and clear must match
  // or browsers keep the cookie (logout silently fails).
  private getCookieOptions = () => {
    const isProduction = ENV.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
      path: "/",
      // CHIPS: lets the cross-site session survive third-party-cookie
      // blocking (e.g. Chrome Incognito). Requires Secure + SameSite=None,
      // so production-only — browsers reject Partitioned without Secure.
      ...(isProduction ? { partitioned: true } : {}),
    };
  };

  private setAuthCookies = async (res: Response, tokens: { accessToken: string, refreshToken: string}) => {
    const base = this.getCookieOptions();

    res.cookie("accessToken", tokens.accessToken, {
      ...base,
      maxAge: ms(15, "minutes")
    })

    res.cookie("refreshToken", tokens.refreshToken, {
      ...base,
      maxAge: ms(7, "days")
    })
  }

  public signup = async (req: Request, res: Response) => {
    const { studentIdNumber, email, password, name } = req.body ?? {};
    const response = await AuthSignupService({studentIdNumber, email, password, name})
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
    // Revoke server-side so a stolen refresh token dies with the session.
    const userId = req.user?.userId;
    if (userId) {
      try {
        await new TokenRepository().revokeAllRefreshTokens(userId);
      } catch (error) {
        console.error("Logout token revocation failed:", error);
      }
    }

    const clearOptions = this.getCookieOptions();
    res.clearCookie("accessToken", clearOptions);
    res.clearCookie("refreshToken", clearOptions);

    return res.status(200).json({ code: 200, status: "success", message: "Logged out successfully" });
  };

  public forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body ?? {};
    const response = await AuthForgetPasswordRequestService({email});
    return res.status(response.code).json(response);
  }

  public resetPassword = async (req: Request, res: Response) => {
    const { newPassword, token } = req.body ?? {};
    const response = await AuthResetPasswordService({newPassword, token})
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
