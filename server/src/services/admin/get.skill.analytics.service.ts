import { AdminRepository } from "@/repositories/admin.repository";

export const GetSkillAnalyticsService = async (forceRefresh: boolean = false) => {
  const adminRepository = new AdminRepository();

  try {
    const skills = await adminRepository.findSkillAnalytics(forceRefresh);

    return {
      code: 200,
      status: "success",
      message: "Fetched skill analytics",
      data: { skills },
    };
  } catch (error) {
    console.error("GetSkillAnalyticsService", error);
    return { code: 500, status: "error", message: "Unable to fetch skill analytics" };
  }
};
