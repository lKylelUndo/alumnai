import { decryptPassword, encryptPassword } from "@/lib/bcrypt";
import { LoginInputTypes, SignupInputTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { signAccessToken, signRefreshToken, TokenExpiry } from "@/lib/jwt";

export class AuthService {
  private userRepository = new UserRepository();

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

      console.log("account", user)

      // Generate Tokens
      const accessToken = signAccessToken(user.id, user.email, user.role);
      const refreshToken = signRefreshToken(user.id, user.email, user.role);

      return { status: "success", code: 200, message: "login from services" };
    } catch (error) {
      console.error("AuthLoginService Error: ", error);
      return {
        code: 500,
        status: "error",
        message: "Unable to login an account",
      };
    }
  };
}
