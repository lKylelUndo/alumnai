import { ForgetPasswordRequestInputTypes } from "@/schema/auth/forget.password.request";
import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";
import { generateResetPasswordToken, hashResetPasswordToken } from "@/utils/crypto";
import { ENV } from "@/config/env";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

export const AuthForgetPasswordRequestService = async (data: ForgetPasswordRequestInputTypes) => {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  try {
    const isAccountExisted = await userRepository.findByEmail(data.email);
    if (!isAccountExisted)
      return { message: "This email is not yet registered or verified", status: "error", code: 400 };

    const rawResetPasswordToken = generateResetPasswordToken();
    const hashedResetPasswordToken = hashResetPasswordToken(rawResetPasswordToken);

    await tokenRepository.storeResetPasswordToken(
      isAccountExisted.id,
      hashedResetPasswordToken,
      new Date(Date.now() + 10 * 60 * 1000)
    );

    const resetPasswordURL = `${ENV.FRONTEND_URL}/reset-password/${rawResetPasswordToken}`;

    const html = renderTemplate("reset-password.html", {
      resetPasswordURL,
    });

    await sendEmail({
      to: isAccountExisted.email ?? "",
      subject: "Reset password link",
      html,
    });

    return {
      message: "Successfully request a password reset link",
      status: "success",
      code: 201,
    };
  } catch (error) {
    console.error("AuthForgetPasswordRequestService", error);
    return { code: 500, status: "error", message: "Unable to request reset password link" };
  }
};
