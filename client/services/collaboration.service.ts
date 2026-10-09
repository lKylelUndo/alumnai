import { axiosInstance, axiosServerInstance } from "@/lib/axios";
import { AcceptCollaborationInviteInput, DeclineCollaborationInviteInput, SendCollaborationInviteInput, } from "@/schema/collaboration";

const getInstance = () => (typeof window !== "undefined" ? axiosInstance : axiosServerInstance)

export const collaborationService = {
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

  getMyStudentCollaborations: async () => {
    const response = await getInstance().get("/api/collaboration/v1/get-my-student-collaborations");
    return response.data;
  },

  getCollabRequests: async () => {
    const response = await getInstance().get("/api/collaboration/v1/get-collab-requests");
    return response.data;
  },

  getSentCollabInvites: async () => {
    const response = await getInstance().get("/api/collaboration/v1/get-sent-collaboration-invites");
    return response.data;
  },
};

