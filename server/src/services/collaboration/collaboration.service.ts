import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { SendCollaborationInviteInputTypes } from "@/schema/collaboration";

export class CollaborationService {
  private collaborationRepository = new CollaborationRepository();

  public acceptCollaboration = async (collaborationId: string) => {
    try {
      const response = await this.collaborationRepository.accept(collaborationId)

      if (!response)
        return { status: "error", code: 400, message: "Failed to accept a collaboration" };

      return { status: "success", code: 200, message: "Successfully accept a collaboration" };
    } catch (error) {
      console.error("AcceptCollaborationService", error);
      return { status: "error", code: 500, message: "Unable to accept a collaboration" };
    }
  };

  public declineCollaboration = async (collaborationId: string) => {
    try {
      const response = await this.collaborationRepository.decline(collaborationId)

      if (!response)
        return { status: "error", code: 400, message: "Failed to decline a collaboration" };

      return { status: "success", code: 200, message: "Successfully decline a collaboration" };
    } catch (error) {
      console.error("DeclineCollaborationService", error);
      return { status: "error", code: 500, message: "Unable to decline a collaboration" };
    }
  };

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

  public endCollaboration = async (collabId: string) => {
    try {
      const response = await this.collaborationRepository.end(collabId);

      if (!response)
        return { status: "error", code: 400, message: "Failed to end a collaboration" };
      
      return { status: "success", code: 200, message: "Successfully end a collaboration" };
    } catch (error) {
      console.error("EndCollabService", error);
      return { status: "error", code: 500, message: "Unable to end a collaboration"}
    }
  }
}
