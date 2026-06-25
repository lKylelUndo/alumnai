import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const AcceptCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const response = await collaborationRepository.accept(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept a collaboration" };

    return { status: "success", code: 200, message: "Successfully accept a collaboration" };
  } catch (error) {
    console.error("AcceptCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to accept a collaboration" };
  }
};
