import { encryptPassword } from "@/lib/bcrypt";
import { ResetPasswordInputTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { TokenRepository } from "@/repositories/token.repository";
import { hashResetPasswordToken } from "@/utils/crypto";

export const AuthResetPasswordService = async (data: ResetPasswordInputTypes) => {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  try {
    const hashedToken = hashResetPasswordToken(data.token);
    const token = await tokenRepository.findResetPasswordToken(hashedToken);

    if (!token)
      return { message: "Invalid or expired token", status: "error", code: 400 };

    // The token itself identifies the account — never trust a client-supplied userId.
    const user = await userRepository.findById(token.userId);

    if (!user) return { message: "Invalid or expired token", status: "error", code: 400 };

    const hashedPassword = await encryptPassword(data.newPassword);

    await userRepository.resetPassword(user.id, hashedPassword);
    await tokenRepository.consumeToken(hashedToken);
    await tokenRepository.revokeAllResetTokens(token.userId, hashedToken);
    // Kill existing sessions so a stolen session dies with the old password.
    await tokenRepository.revokeAllRefreshTokens(token.userId);

    return {
      message: "Successfully reset password",
      status: "success",
      code: 200,
    };
  } catch (error) {
    console.error("AuthResetPasswordService", error);
    return { code: 500, status: "error", message: "Unable to reset password" };
  }
};
