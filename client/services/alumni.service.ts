import { axiosInstance } from "@/lib/axios";

export type AlumniStudentCard = {
  id: string
  recordId: string
  name: string
  track: string
  year: string
  status: string
  profilePicture?: string | null
  message?: string
}

export const alumniService = {
  requestAlumniUpgrade: async (documentUrl: string) => {
    const response = await axiosInstance.post("/api/alumni/v1/request-alumni-upgrade", { documentUrl });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get("/api/alumni/v1/get-dashboard-stats");
    return response.data;
  },

  findCollaborators: async () => {
    const response = await axiosInstance.get("/api/alumni/v1/find-collaborators");
    return response.data;
  },

  getMyMentees: async () => {
    const response = await axiosInstance.get("/api/alumni/v1/get-my-mentees");
    return response.data;
  },

  getMyCollaborations: async () => {
    const response = await axiosInstance.get("/api/alumni/v1/get-my-collaborations");
    return response.data;
  },

  getMentorshipRequests: async () => {
    const response = await axiosInstance.get("/api/alumni/v1/get-mentorship-requests");
    return response.data;
  },
};
