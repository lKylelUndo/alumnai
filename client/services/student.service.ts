import { axiosInstance } from "@/lib/axios"

export const studentService = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/api/student/v1/get-dashboard-stats")
    return response.data
  }
}