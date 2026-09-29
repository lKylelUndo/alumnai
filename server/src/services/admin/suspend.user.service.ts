import { notifyRole } from "@/lib/socket";
import { AdminRepository } from "@/repositories/admin.repository";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

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

        const html = renderTemplate("account-suspended.html", {});

        await sendEmail({
            to: suspendedUser.email ?? "",
            subject: "Your account has been suspended",
            html,
        });
            
        notifyRole("admin", "admin:refresh", { targets: ["all-users", "stats"] });

        return { status: "success", code: 200, message: "User suspended successfully", data: suspendedUser };
    } catch (error) {
        console.error("SuspendUserService", error);
        return { status: "error", code: 500, message: "Unable to suspend a user" };
    }
};
