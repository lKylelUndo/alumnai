import { StudentRepository } from "@/repositories/student.repository";

export const FindMentorsService = async (userId: string) => {
  const studentRepository = new StudentRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400 };

    const response = await studentRepository.findMentors(userId);

    if (!response)
      return { status: "error", message: "Failed to fetch mentors", code: 500, data: [] };

    return {
      status: "success",
      message: "Mentors fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("FindMentorsService", error);
    return {
      status: "error",
      message: "Failed to fetch mentors",
      code: 500,
      data: [],
    };
  }
};
