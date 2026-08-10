import { AdminRepository } from "@/repositories/admin.repository";

export const GetUnverifiedUsersService = async () => {
  const adminRepository = new AdminRepository();

  try {
    const users = await adminRepository.findUnverified();

    return {
      code: 200,
      status: "success",
      message: "Fetched unverified users",
      data: { users },
    };
  } catch (error) {
    console.error("GetUnverifiedUsersService", error);
    return { code: 500, status: "error", message: "Unable to fetch unverified users" };
  }
};
