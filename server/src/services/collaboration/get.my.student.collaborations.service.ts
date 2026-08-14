import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const GetMyStudentCollaborationsService = async (userId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const response = await collaborationRepository.getActiveCollaborations(userId);

    return {
      status: "success",
      message: "Collaborations fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetMyStudentCollaborationsService", error);
    return {
      status: "error",
      message: "Failed to fetch collaborations",
      code: 500,
      data: [],
    };
  }
};
