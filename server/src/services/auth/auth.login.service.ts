import { decryptPassword } from "@/lib/bcrypt";
import { LoginInputTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { signAccessToken, signRefreshToken, TokenExpiry } from "@/lib/jwt";
import { TokenRepository } from "@/repositories/token.repository";

export const AuthLoginService = async (data: LoginInputTypes) => {
  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  try {
    const user = await userRepository.findByEmail(data.email);

    if (!user)
      return { status: "error", code: 400, path: "email", message: "This user is not yet signed up" };

    if (!user?.isAccountVerified)
      return { status: "error", code: 400, path: "email", message: "This account is not yet verified" };

    if ((await decryptPassword(data.password, user.password)) === false)
      return { status: "error", code: 400, path: "password", message: "Password incorrect" };

    const accessToken = signAccessToken(user.id, user.email, user.role);
    const refreshToken = signRefreshToken(user.id, user.email, user.role);

    await tokenRepository.storeRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    const { password, ...rest } = user;

    return {
      status: "success",
      code: 200,
      message: "Login successfully",
      data: {
        tokens: {
          accessToken,
          refreshToken,
          accessTokenExpiresIn: TokenExpiry.ACCESS_TOKEN_EXPIRES,
          refreshTokenExpiresIn: TokenExpiry.REFRESH_TOKEN_EXPIRES,
        },
        user: rest,
      },
    };
  } catch (error) {
    console.error("AuthLoginService", error);
    return { code: 500, status: "error", message: "Unable to login an account" };
  }
};
