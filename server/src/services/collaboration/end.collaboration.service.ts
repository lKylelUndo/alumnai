import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const EndCollaborationService = async (collabId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const response = await collaborationRepository.end(collabId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end a collaboration" };

    return { status: "success", code: 200, message: "Successfully end a collaboration" };
  } catch (error) {
    console.error("EndCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to end a collaboration" };
  }
};
