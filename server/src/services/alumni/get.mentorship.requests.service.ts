import { AlumniRepository } from "@/repositories/alumni.repository";

export const GetMentorshipRequestsService = async (userId: string) => {
  const alumniRepository = new AlumniRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const response = await alumniRepository.getPendingMentorshipRequests(userId);

    return {
      status: "success",
      message: "Mentorship requests fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetMentorshipRequestsService", error);
    return {
      status: "error",
      message: "Failed to fetch mentorship requests",
      code: 500,
      data: [],
    };
  }
};
