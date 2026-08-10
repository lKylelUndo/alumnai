import { AlumniRepository } from "@/repositories/alumni.repository";

export const FindRandomCollaboratorsService = async (userId: string) => {
  const alumniRepository = new AlumniRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400 };

    const response = await alumniRepository.findStudents(userId);

    if (!response)
      return { status: "error", message: "Failed to fetch collaborators", code: 500, data: [] };

    return {
      status: "success",
      message: "Collaborators fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("FindRandomCollaboratorsService", error);
    return {
      status: "error",
      message: "Failed to fetch collaborators",
      code: 500,
      data: [],
    };
  }
};
