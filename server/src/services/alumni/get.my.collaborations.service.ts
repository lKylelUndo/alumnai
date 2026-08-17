import { AlumniRepository } from "@/repositories/alumni.repository";

export const GetMyCollaborationsService = async (userId: string) => {
  const alumniRepository = new AlumniRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const response = await alumniRepository.getActiveCollaborations(userId);

    return {
      status: "success",
      message: "Collaborations fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetMyCollaborationsService", error);
    return {
      status: "error",
      message: "Failed to fetch collaborations",
      code: 500,
      data: [],
    };
  }
};
