import { axiosInstance, axiosServerInstance } from "@/lib/axios"

const getInstance = () => (typeof window !== "undefined" ? axiosInstance : axiosServerInstance)

export const studentService = {
  getDashboardStats: async () => {
    const response = await getInstance().get("/api/student/v1/get-dashboard-stats")
    return response.data
  },

  findMentors: async () => {
    const response = await getInstance().get("/api/student/v1/find-mentors")
    return response.data
  },
}
