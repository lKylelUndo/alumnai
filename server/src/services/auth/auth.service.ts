import { AuthRepository } from "@/repositories/auth.repository";
import { SignupInputTypes } from "@/schema/auth/signup.schema";
import { encryptPassword } from "@/lib/bcrypt";

export class AuthService {
  private authRepository = new AuthRepository();

  public signup = async (data: SignupInputTypes) => {
    data.password = await encryptPassword(data.password);
    const isEmailExisted = await this.authRepository.findByEmail(data.email);

    if (isEmailExisted) 
      return {
        message: "The email used for this account is already pending for approval.",
        status: "error",
        code: 400,
      };
    
    const response = await this.authRepository.signup(data);

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
  };

  public login = async () => {
    return { message: "login from services" };
  };
}
