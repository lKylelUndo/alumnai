import { AdminRepository } from "@/repositories/admin.repository";

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

    return {
      message: `Successfully verify a user - Student ID Number: ${response.student_id_number}`,
      status: "success",
      code: 200,
    };
  };
}
