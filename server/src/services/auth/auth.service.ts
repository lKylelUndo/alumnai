import { decryptPassword, encryptPassword } from "@/lib/bcrypt";
import { LoginInputTypes, SignupInputTypes, VerifyResetPasswordTokenTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { signAccessToken, signRefreshToken, TokenExpiry } from "@/lib/jwt";
import { TokenRepository } from "@/repositories/token.repository";
import { ForgetPasswordRequestInputTypes } from "@/schema/auth/forget.password.request";
import { generateResetPasswordToken, hashResetPasswordToken } from "@/utils/crypto";
import { ENV } from "@/config/env";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "../mail/mailer";

export class AuthService {
  private userRepository = new UserRepository();
  private tokenRepository = new TokenRepository();

  public signup = async (data: SignupInputTypes) => {
    try {
      data.password = await encryptPassword(data.password);
      const isEmailExisted = await this.userRepository.findByEmail(data.email);

      if (isEmailExisted)
        return {
          message: "The email used for this account is already pending for approval.",
          status: "error",
          code: 400,
        };

      const response = await this.userRepository.signup(data);

      if (Object.keys(response).length === 0)
        return {
          message: "Error occur during signup",
          status: "error",
          code: 400,
        };

      return {
        message: "Successfully signup - wait for the approval",
        status: "success",
        code: 201,
      };
    } catch (error) {
      console.error("AuthSignUpService Error: ", error);
      return {
        code: 500,
        status: "error",
        message: "Unable to signup an account",
      };
    }
  };

  public login = async (data: LoginInputTypes) => {
    try {
      const user = await this.userRepository.findByEmail(data.email);

      if (!user)
        return { status: "error", code: 400, message: "This user is not yet signed up" };

      if (!user?.isAccountVerified)
        return { status: "error", code: 400, message: "This account is not yet verified" };

      if (await decryptPassword(data.password, user.password) === false)
        return { status: "error", code: 400, message: "Password incorrect" };

      // Generate Tokens
      const accessToken = signAccessToken(user.id, user.email, user.role);
      const refreshToken = signRefreshToken(user.id, user.email, user.role);

      // Save refresh token to DB
      await this.tokenRepository.storeRefreshToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

      return {
        status: "success", 
        code: 200, 
        message: "Login successfully",
        data: {
          tokens: {
            accessToken,
            refreshToken,
            accessTokenExpiresIn: TokenExpiry.ACCESS_TOKEN_EXPIRES,
            refreshTokenExpiresIn: TokenExpiry.REFRESH_TOKEN_EXPIRES
          },
          user
        }
      };

    } catch (error) {
      console.error("AuthLoginService Error: ", error);
      return { code: 500, status: "error", message: "Unable to login an account" };
    }
  };

  public forgetPasswordRequest = async (data: ForgetPasswordRequestInputTypes) => {
    try {
      const isAccountExisted = await this.userRepository.findByEmail(data.email)
      if (!isAccountExisted)
        return {message: "This email is not yet registered or verified", status: "error", code: 400};
      

      // Generate token using crypto node
      const rawResetPasswordToken = generateResetPasswordToken();
      const hashedResetPasswordToken = hashResetPasswordToken(rawResetPasswordToken);
 
      await this.tokenRepository.storeResetPasswordToken(isAccountExisted.id, hashedResetPasswordToken, new Date(Date.now() + 10 * 60 * 1000))
      
      // Generate a url for reset password link
      const resetPasswordURL = `${ENV.FRONTEND_URL}/reset-password/${rawResetPasswordToken}`;

      // Format email for official verified 
      const html = renderTemplate("reset-password.html", {
        resetPasswordURL,
      })

      // Send Email Verification
      await sendEmail({
        to: isAccountExisted.email ?? "",
        subject: "Reset password link",
        html,
      });

      return { 
        message: "Successfully request a password reset link", 
        status: "success", 
        code: 201 
      }
    } catch (error) {
      console.error("AuthForgetPasswordRequestService Error: ", error);
      return { code: 500, status: "error", message: "Unable to request reset password link" };
    }
  }

  public verifyResetPasswordToken = async (data: VerifyResetPasswordTokenTypes) => {
    try {
      const hashedToken = hashResetPasswordToken(data.token)
      const token = await this.tokenRepository.findToken(hashedToken)
      console.log("tokzz",token);
      return {
        message: "Successfully verified token",
        status: "success",
        code: 200
      }
    } catch (error) {
      console.error("VerifyResetPasswordTokenService", error);
       return { code: 500, status: "error", message: "Unable to verify reset password token if valid" };
    }
  }
}
