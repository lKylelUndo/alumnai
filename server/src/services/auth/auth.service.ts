import { decryptPassword, encryptPassword } from "@/lib/bcrypt";
import { LoginInputTypes, SignupInputTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { signAccessToken, signRefreshToken, TokenExpiry } from "@/lib/jwt";
import { TokenRepository } from "@/repositories/token.repository";

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
}
