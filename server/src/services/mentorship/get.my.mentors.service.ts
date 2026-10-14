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

// Viewer-safe variant: any authenticated user (alumni, student, admin) may see
// a student's ACTIVE mentors when viewing their profile. Same query, same
// public fields — the only difference is the student id comes from the URL
// instead of the auth token.
export const GetStudentMentorsService = async (studentId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    if (!studentId)
      return { status: "error", message: "Student ID is required", code: 400, data: [] };

    const response = await mentorshipRepository.getActiveMentors(studentId);

    return {
      status: "success",
      message: "Mentors fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetStudentMentorsService", error);
    return {
      status: "error",
      message: "Failed to fetch mentors",
      code: 500,
      data: [],
    };
  }
};
