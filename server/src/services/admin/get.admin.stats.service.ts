import { AdminRepository } from "@/repositories/admin.repository";

export const GetAdminStatsService = async () => {
  const adminRepository = new AdminRepository();

  try {
    const stats = await adminRepository.getDashboardStats();

    return {
      code: 200,
      status: "success",
      message: "Fetched admin dashboard stats",
      data: stats,
    };
  } catch (error) {
    console.error("GetAdminStatsService", error);
    return { code: 500, status: "error", message: "Unable to fetch admin dashboard stats" };
  }
};
