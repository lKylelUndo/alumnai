import axiosInstance from "@/lib/axios";
import { AcceptCollaborationInviteInput, DeclineCollaborationInviteInput, SendCollaborationInviteInput, } from "@/schema/collaboration";

export const collaborationService = {
  viewMyCollabInvites: async () => {
    const response = await axiosInstance.post("/api/collaboration/v1/view-my-collab-invites");
    return response.data;
  },

  acceptCollab: async (data: AcceptCollaborationInviteInput) => {
    const response = await axiosInstance.post("/api/collaboration/v1/accept-collab", data);
    return response.data;
  },

  declineCollab: async (data: DeclineCollaborationInviteInput) => {
    const response = await axiosInstance.delete("/api/collaboration/v1/decline-collab", { data });
    return response.data;
  },

  sendCollabInvite: async (data: SendCollaborationInviteInput) => {
    const response = await axiosInstance.post("/api/collaboration/v1/send-collab-invite", data);
    return response.data;
  },

  endCollab: async (data: DeclineCollaborationInviteInput) => {
    const response = await axiosInstance.delete("/api/collaboration/v1/end-collab", { data });
    return response.data;
  },
};
