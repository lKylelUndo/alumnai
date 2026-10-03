import { notifyRole } from "@/lib/socket";
import { AdminRepository } from "@/repositories/admin.repository";
import { sendNotificationEmail } from "@/services/mail/notify";

export const SuspendUserService = async (id: string) => {
    const adminRepository = new AdminRepository();

    try {
        const user = await adminRepository.findById(id)

        if (!user) 
            return { status: "error", code: 404, message: "User not found" };
        if(user.role === "ADMIN")
            return { status: "error", code: 403, message: "Cannot suspend admin" };
        if(!user.isAccountVerified)
            return { status: "error", code: 400, message: "User is not verified" };
        if(user.accountStatus === "SUSPENDED")
            return { status: "error", code: 400, message: "User is already suspended" };
        
        const suspendedUser = await adminRepository.suspend(id);

        if (!suspendedUser)
            return { status: "error", code: 500, message: "Unable to suspend a user" };

        await adminRepository.invalidateCache(["all-users", "dashboard-stats"]);

        // Best-effort: a failed notice must not fail a completed suspension.
        await sendNotificationEmail({
            service: "SuspendUserService",
            to: suspendedUser.email,
            template: "account-suspended.html",
            data: {},
            subject: "Your account has been suspended",
        });
            
        notifyRole("admin", "admin:refresh", { targets: ["all-users", "stats"] });

        return { status: "success", code: 200, message: "User suspended successfully", data: suspendedUser };
    } catch (error) {
        console.error("SuspendUserService", error);
        return { status: "error", code: 500, message: "Unable to suspend a user" };
    }
};
