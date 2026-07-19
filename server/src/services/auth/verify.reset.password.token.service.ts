import { VerifyResetPasswordTokenTypes } from "@/schema/auth";
import { TokenRepository } from "@/repositories/token.repository";
import { hashResetPasswordToken } from "@/utils/crypto";

export const AuthVerifyResetPasswordTokenService = async (data: VerifyResetPasswordTokenTypes) => {
  const tokenRepository = new TokenRepository();

  try {
    const hashedToken = hashResetPasswordToken(data.token);
    const token = await tokenRepository.findResetPasswordToken(hashedToken);

    if (!token)
      return { message: "Invalid or expired reset password token", status: "error", code: 400 };

    return {
      message: "Successfully verified token",
      status: "success",
      code: 200,
    };
  } catch (error) {
    console.error("AuthVerifyResetPasswordTokenService", error);
    return { code: 500, status: "error", message: "Unable to verify reset password token if valid" };
  }
};
