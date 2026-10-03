import { notifyRole } from "@/lib/socket";
import { AdminRepository } from "@/repositories/admin.repository"
import { sendNotificationEmail } from "@/services/mail/notify";

export const RejectUserService = async (id: string) => {
    const adminRepository = new AdminRepository();
    try {
        // Fetch first: the delete below removes the row, and its email is
        // needed for the rejection notice afterwards.
        const target = await adminRepository.findByStudentIdNumber(id);

        if (!target) {
            return { status: "error", code: 404, message: "User not found" };
        }

        const refreshed = await adminRepository.reject(id);

        // Best-effort: a failed notice must not fail a completed rejection.
        await sendNotificationEmail({
            service: "RejectUserService",
            to: target.email,
            template: "request-rejected.html",
            data: { requestType: "account registration" },
            subject: "Update on your account registration",
        });

        notifyRole("admin", "admin:refresh", { targets: ["alumni-requests", "stats"] });

        return {
            status: "success",
            code: 200,
            message: "User rejected successfully",
            data: refreshed,
        }
    } catch (error) {
        console.error("RejectUserService", error);
        // Lost a race with another admin action on the same row.
        if ((error as { code?: string })?.code === "P2025") {
            return { status: "error", code: 404, message: "User not found" };
        }
        return { status: "error", code: 500, message: "Unable to reject a user" };
    }
}