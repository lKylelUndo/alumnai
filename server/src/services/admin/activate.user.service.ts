import { notifyRole } from "@/lib/socket";
import { AdminRepository } from "@/repositories/admin.repository";
import { ENV } from "@/config/env";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

export const ActivateUserService = async (id: string) => {
  const adminRepository = new AdminRepository();

  try {
    const user = await adminRepository.findById(id);

    if (!user)
      return { status: "error", code: 404, message: "User not found" };
    if (user.role === "ADMIN")
      return { status: "error", code: 403, message: "Cannot modify admin status" };
    if (user.accountStatus === "ACTIVE")
      return { status: "error", code: 400, message: "User is already active" };

    const activatedUser = await adminRepository.activate(id);

    if (!activatedUser)
      return { status: "error", code: 500, message: "Unable to activate user" };

    await adminRepository.invalidateCache(["all-users", "dashboard-stats"]);

    const backToLoginURL = `${ENV.FRONTEND_URL}/login`;

    const html = renderTemplate("account-reactivated.html", {
      backToLoginURL,
    });

    await sendEmail({
      to: activatedUser.email ?? "",
      subject: "Your account is active again",
      html,
    });

    notifyRole("admin", "admin:refresh", { targets: ["all-users", "stats"] });

    return { status: "success", code: 200, message: "User activated successfully", data: activatedUser };
  } catch (error) {
    console.error("ActivateUserService", error);
    return { status: "error", code: 500, message: "Unable to activate user" };
  }
};
