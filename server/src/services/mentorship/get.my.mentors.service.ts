import { MentorshipRepository } from "@/repositories/mentorship.repository";

export const GetMyMentorsService = async (userId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const response = await mentorshipRepository.getActiveMentors(userId);

    return {
      status: "success",
      message: "Mentors fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetMyMentorsService", error);
    return {
      status: "error",
      message: "Failed to fetch mentors",
      code: 500,
      data: [],
    };
  }
};
