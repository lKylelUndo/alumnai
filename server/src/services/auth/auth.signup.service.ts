import { encryptPassword } from "@/lib/bcrypt";
import { SignupInputTypes } from "@/schema/auth";
import { UserRepository } from "@/repositories/user.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ENV } from "@/config/env";
import { sendNotificationEmail } from "@/services/mail/notify";

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

    const isStudentIdExisted = await userRepository.findByStudentIdNumber(data.studentIdNumber);

    if (isStudentIdExisted)
      return {
        message: "This student ID number is already registered.",
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

    // The new row changes the unverified queue and the dashboard totals —
    // drop both keys so the next admin read repopulates fresh instead of
    // serving up to 5 minutes of stale cache. Best-effort (never throws).
    const adminRepository = new AdminRepository();
    await adminRepository.invalidateCache(["unverified-users", "dashboard-stats"]);

    const backToLoginURL = `${ENV.FRONTEND_URL}/login`;

    // Best-effort: a failed welcome email must not fail a completed signup.
    await sendNotificationEmail({
      service: "AuthSignupService",
      to: data.email,
      template: "signup-pending.html",
      data: { backToLoginURL, name: data.name },
      subject: "Registration received - pending approval",
    });

    return {
      message: "Successfully signup - wait for the approval",
      status: "success",
      code: 201,
    };
  } catch (error) {
    console.error("AuthSignupService", error);
    // Race between the duplicate checks above and the insert.
    if ((error as { code?: string })?.code === "P2002")
      return {
        message: "This student ID number is already registered.",
        status: "error",
        code: 400,
      };
    return {
      code: 500,
      status: "error",
      message: "Unable to signup an account",
    };
  }
};
