import { ENV } from "@/config/env";
import { AdminRepository } from "@/repositories/admin.repository";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

export class AdminService {
  private adminRepository = new AdminRepository();

  public verify = async (id: string) => {
    const account = await this.adminRepository.findById(id);
    if (account?.isAccountVerified)
      return {
        code: 400,
        status: "error",
        message: `Account with id - ${account.id} - is already verified user`,
      };

    const response = await this.adminRepository.verify(id);

    if (Object.keys(response).length === 0)
      return {
        message: "Error occur during verification of user",
        status: "error",
        code: 400,
      };

    // Generate a url for back to login
    const backToLoginURL = `${ENV.FRONTEND_URL}/login`; 

    // Format email for official verified 
    const html = renderTemplate("verified-email.html", {
      studentIdNumber: response.student_id_number,
      backToLoginURL,
    })

     // Send Email Verification
    await sendEmail({
      to: response.email ?? "",
      subject: "You are now a verified user",
      html,
    });

    return {
      message: `Successfully verify a user - Student ID Number: ${response.student_id_number}`,
      status: "success",
      code: 200,
    };
  };
}
