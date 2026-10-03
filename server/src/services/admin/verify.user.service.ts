import { ENV } from "@/config/env";
import { AdminRepository } from "@/repositories/admin.repository";
import { sendNotificationEmail } from "@/services/mail/notify";
import { notifyRole } from "@/lib/socket";

export const VerifyUserService = async (id: string) => {
  const adminRepository = new AdminRepository();

  try {
    // Look up by student ID number — the same key verify() updates by.
    const account = await adminRepository.findByStudentIdNumber(id);
    if (!account)
      return {
        code: 404,
        status: "error",
        message: "User not found",
      };
    if (account.isAccountVerified)
      return {
        code: 400,
        status: "error",
        message: `Account with id - ${account.id} - is already verified user`,
      };

    const response = await adminRepository.verify(id);

    if (Object.keys(response).length === 0)
      return {
        message: "Error occur during verification of user",
        status: "error",
        code: 400,
      };

    // Invalidate admin caches
    await adminRepository.invalidateCache(["unverified-users", "all-users", "dashboard-stats"]);

    const backToLoginURL = `${ENV.FRONTEND_URL}/login`;

    // Best-effort: a failed notice must not fail a completed verification.
    await sendNotificationEmail({
      service: "VerifyUserService",
      to: response.email,
      template: "verified-email.html",
      data: {
        studentIdNumber: response.student_id_number,
        backToLoginURL,
      },
      subject: "You are now a verified user",
    });

    // Notify all admin client components to refresh
    notifyRole("admin", "admin:refresh", { targets: ["unverified-users", "stats", "all-users"] });

    return {
      message: `Successfully verify a user - Student ID Number: ${response.student_id_number}`,
      status: "success",
      code: 200,
    };
  } catch (error) {
    console.error("VerifyUserService", error);
    // Lost a race with another admin action on the same row.
    if ((error as { code?: string })?.code === "P2025")
      return { status: "error", code: 404, message: "User not found" };
    return { status: "error", code: 500, message: "Unable to verify a user" };
  }
};
