import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const DeclineCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const response = await collaborationRepository.decline(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline a collaboration" };

    return { status: "success", code: 200, message: "Successfully decline a collaboration" };
  } catch (error) {
    console.error("DeclineCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to decline a collaboration" };
  }
};
