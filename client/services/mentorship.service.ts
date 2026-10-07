import { axiosInstance, axiosServerInstance } from "@/lib/axios";
import { AcceptMentorshipInviteInput, DeclineMentorshipInviteInput, SendMentorshipInviteInput, RecognizeAlumniInput } from "@/schema/mentorship";
import { RecognitionVisibilityResponse } from "@/lib/types/mentorship";

const getInstance = () => (typeof window !== "undefined" ? axiosInstance : axiosServerInstance)

export const mentorshipService = {
  viewMyMentorshipInvites: async () => {
    const response = await axiosInstance.get("/api/mentorship/v1/view-my-mentorship-invites");
    return response.data;
  },

  acceptMentorship: async (data: AcceptMentorshipInviteInput) => {
    const response = await axiosInstance.post("/api/mentorship/v1/accept-mentorship", data);
    return response.data;
  },

  declineMentorship: async (data: DeclineMentorshipInviteInput) => {
    const response = await axiosInstance.delete("/api/mentorship/v1/decline-mentorship", { data });
    return response.data;
  },

  sendMentorshipInvite: async (data: SendMentorshipInviteInput) => {
    const response = await axiosInstance.post("/api/mentorship/v1/send-mentorship-invite", data);
    return response.data;
  },

  endMentorship: async (data: DeclineMentorshipInviteInput) => {
    const response = await axiosInstance.delete("/api/mentorship/v1/end-mentorship", { data });
    return response.data;
  },

  getMyMentees: async () => {
    const response = await getInstance().get("/api/mentorship/v1/get-my-mentees");
    return response.data;
  },

  getMentorshipRequests: async () => {
    const response = await getInstance().get("/api/mentorship/v1/get-mentorship-requests");
    return response.data;
  },

  getMyMentors: async () => {
    const response = await getInstance().get("/api/mentorship/v1/get-my-mentors");
    return response.data;
  },

  recognizeAlumni: async (data: RecognizeAlumniInput) => {
    const response = await axiosInstance.post("/api/mentorship/v1/recognize-alumni", data);
    return response.data;
  },

  getMentorRecognition: async (alumniId: string) => {
    const response = await axiosInstance.get(`/api/mentorship/v1/get-recognition/${alumniId}`);
    return response.data;
  },

  setRecognitionVisibility: async (
    recognitionId: string,
    isVisible: boolean
  ): Promise<RecognitionVisibilityResponse> => {
    const response = await axiosInstance.patch(
      `/api/mentorship/v1/recognition/${recognitionId}/visibility`,
      { isVisible }
    );
    return response.data as RecognitionVisibilityResponse;
  },
};


