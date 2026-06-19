import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { SendCollaborationInviteInputTypes } from "@/schema/collaboration";

export class CollaborationService {
  private collaborationRepository = new CollaborationRepository();

  public acceptCollaboration = async () => {};

  public declineCollaboration = async () => {};

  public viewAllCollaborationInvites = async (userId: string) => {
    try {
      const response = await this.collaborationRepository.getAllInvites(userId);

      if (Object.keys(response).length === 0)
        return {
          status: "error",
          code: 400,
          message: "No collaboration invites at the moment",
        };

      return { status: "success", code: 200, collab_invites: response };
    } catch (error) {
      console.error("ViewAllCollaborationInviteService", error);
      return {
        status: "error",
        code: 500,
        message: "Unable to get all collaboration invites",
      };
    }
  };

  public sendCollaborationInvite = async (userId: string, data: SendCollaborationInviteInputTypes) => {
    try {
        const alreadyInvited = await this.collaborationRepository.findInviteIfExisted(userId, data.toStudentId)
        
        if (alreadyInvited) 
          return { status: "error", code: 400, message: "You already sent an invitation" };
  
        const response = await this.collaborationRepository.send(userId, data);

        if (Object.keys(response).length === 0)
          return { status: "error", code: 400, message: "Failed to send an invitation"}

        return { status: "success", code: 200, message: "Successfully send an invitation" };
    } catch (error) {
        console.error("SendCollaborationInviteService", error);
        return { status: "error", code: 500, message: "Unable to send an invitation"}
    }
  };
}
