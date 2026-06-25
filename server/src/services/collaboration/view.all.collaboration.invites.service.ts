import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const ViewAllCollaborationInvitesService = async (userId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const response = await collaborationRepository.getAllInvites(userId);

    if (Object.keys(response).length === 0)
      return {
        status: "error",
        code: 400,
        message: "No collaboration invites at the moment",
      };

    return { status: "success", code: 200, collab_invites: response };
  } catch (error) {
    console.error("ViewAllCollaborationInvitesService", error);
    return {
      status: "error",
      code: 500,
      message: "Unable to get all collaboration invites",
    };
  }
};
