import { notifyRole } from "@/lib/socket";
import { AdminRepository } from "@/repositories/admin.repository"

export const RejectUserService = async (id: string) => {
    const adminRepository = new AdminRepository();
    try {
        const user = await adminRepository.reject(id);

        if (!user) {
            return { status: "error", code: 404, message: "User not found" };
        }

        // TODO 
        // send email to user

        notifyRole("admin", "admin:refresh", { targets: ["alumni-requests", "stats"] });

        return {
            status: "success",
            code: 200,
            message: "User rejected successfully",
            data: user,
        }
    } catch (error) {
        console.error("RejectUserService", error);
        return { status: "error", code: 500, message: "Unable to reject a user" };
    }
}