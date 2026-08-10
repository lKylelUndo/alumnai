import { axiosServerInstance, axiosInstance } from "@/lib/axios"

const getInstance = () => (typeof window !== "undefined" ? axiosInstance : axiosServerInstance)

export const adminService = {
  getUnverifiedUsers: async () => {
    const response = await getInstance().get("/api/admin/v1/get-unverified-users")
    return response.data
  },
  
  verifyUser: async (id: string) => {
    const response = await axiosInstance.post("/api/admin/v1/verify-a-user", { id })
    return response.data  
  },

  rejectUser: async (id: string) => {
    const response = await axiosInstance.delete("/api/admin/v1/reject-a-user", { data: { id } })
    return response.data
  },

  getTopMentors: async () => {
    const response = await getInstance().get("/api/admin/v1/get-top-mentors")
    return response.data
  },

  getAlumniRequest: async () => {
    const response = await getInstance().get("/api/admin/v1/get-alumni-request")
    return response.data
  },

  approveAlumniRequest: async (studentId: string) => {
    const response = await axiosInstance.put("/api/admin/v1/approve-alumni-request", { studentId })
    return response.data
  },

  rejectAlumniRequest: async (studentId: string) => {
    const response = await axiosInstance.put("/api/admin/v1/reject-alumni-request", { studentId })
    return response.data
  },

  getAllUsers: async () => {
    const response = await getInstance().get("/api/admin/v1/get-all-users")
    return response.data
  },

  activateUser: async (id: string) => {
    const response = await axiosInstance.put("/api/admin/v1/activate-a-user", { id })
    return response.data
  },

  suspendUser: async (id: string) => {
    const response = await axiosInstance.put("/api/admin/v1/suspend-a-user", { id })
    return response.data
  },

  getSkillTrendAnalytics: async (refresh = false) => {
    const url = refresh ? "/api/skill/v1/get-top-alumni-skills?refresh=true" : "/api/skill/v1/get-top-alumni-skills"
    const response = await getInstance().get(url)
    return response.data
  },

  getDashboardStats: async () => {
    // All in one API for admin dashboard stats
    const response = await getInstance().get("/api/admin/v1/get-stats")
    return response.data
  },
}
