import { axiosServerInstance, axiosInstance } from "@/lib/axios"
import { VerifyUserInput } from "@/schema/admin"
import { cookies } from "next/headers"

export const adminService = {
  getUnverifiedUsers: async () => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    const response = await axiosServerInstance.get(
      "/api/admin/v1/get-unverified-users",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    return response.data
  },

  verifyUser: async (data: VerifyUserInput) => {
    const response = await axiosInstance.post(
      "/api/admin/v1/verify-a-user",
      data
    )
    return response.data
  },
}
