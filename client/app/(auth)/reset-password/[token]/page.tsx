import ResetPasswordForm from "@/components/features/auth/ForgetPasswordForm"
import axiosInstance from "@/lib/axios"

export default async function ResetPasswordPage({ params}: { params: Promise<{ token: string }>}) {
  const { token } = await params

  const response = await axiosInstance.post("/api/auth/v1/verify-token")

  return (
    <>
      <ResetPasswordForm token={token} />
    </>
  )
}
