import { AdminRepository } from "@/repositories/admin.repository";

export const GetAllUsersService = async () => {
  const adminRepository = new AdminRepository();

  try {
    const users = await adminRepository.findAllUsers();

    return {
      code: 200,
      status: "success",
      message: "Fetched all users",
      data: { users },
    };
  } catch (error) {
    console.error("GetAllUsersService", error);
    return { code: 500, status: "error", message: "Unable to fetch users" };
  }
};
