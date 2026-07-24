import { AdminRepository } from "@/repositories/admin.repository";

export const GetTopMentorsService = async () => {
  const adminRepository = new AdminRepository();

  try {
    const mentors = await adminRepository.findTopMentors();

    return {
      code: 200,
      status: "success",
      message: "Fetched top mentors",
      data: { mentors },
    };
  } catch (error) {
    console.error("GetTopMentorsService", error);
    return { code: 500, status: "error", message: "Unable to fetch top mentors" };
  }
};
