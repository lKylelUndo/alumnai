import { encryptPassword } from "@/lib/bcrypt";
import { SignupInputTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { ENV } from "@/config/env";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

export const AuthSignupService = async (data: SignupInputTypes) => {
  const userRepository = new UserRepository();

  try {
    data.password = await encryptPassword(data.password);
    const isEmailExisted = await userRepository.findByEmail(data.email);

    if (isEmailExisted)
      return {
        message: "The email used for this account is already pending for approval.",
        status: "error",
        code: 400,
      };

    const response = await userRepository.signup(data);

    if (Object.keys(response).length === 0)
      return {
        message: "Error occur during signup",
        status: "error",
        code: 400,
      };

    const backToLoginURL = `${ENV.FRONTEND_URL}/login`;

    const html = renderTemplate("signup-pending.html", {
      backToLoginURL,
    });

    await sendEmail({
      to: data.email ?? "",
      subject: "Registration received - pending approval",
      html,
    });

    return {
      message: "Successfully signup - wait for the approval",
      status: "success",
      code: 201,
    };
  } catch (error) {
    console.error("AuthSignupService", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to signup an account",
    };
  }
};
