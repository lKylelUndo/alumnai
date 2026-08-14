import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const GetCollabRequestsService = async (userId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const response = await collaborationRepository.getPendingInvites(userId);

    return {
      status: "success",
      message: "Collaboration requests fetched successfully",
      code: 200,
      data: response,
    };
  } catch (error) {
    console.error("GetCollabRequestsService", error);
    return {
      status: "error",
      message: "Failed to fetch collaboration requests",
      code: 500,
      data: [],
    };
  }
};
