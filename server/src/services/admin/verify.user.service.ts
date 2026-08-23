import { ENV } from "@/config/env";
import { AdminRepository } from "@/repositories/admin.repository";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";
import { notifyRole } from "@/lib/socket";

export const VerifyUserService = async (id: string) => {
  const adminRepository = new AdminRepository();

  try {
    const account = await adminRepository.findById(id);
    if (account?.isAccountVerified)
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

    const backToLoginURL = `${ENV.FRONTEND_URL}/login`;

    const html = renderTemplate("verified-email.html", {
      studentIdNumber: response.student_id_number,
      backToLoginURL,
    });

    await sendEmail({
      to: response.email ?? "",
      subject: "You are now a verified user",
      html,
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
    return { status: "error", code: 500, message: "Unable to verify a user" };
  }
};
