import ResetPasswordForm from "@/components/features/auth/ForgetPasswordForm"
import { axiosInstance } from "@/lib/axios"
import { notFound } from "next/navigation"

export default async function ResetPasswordPage({ params}: { params: Promise<{ token: string }>}) {
  const { token } = await params

  const response = await axiosInstance.post('/api/auth/v1/verify-reset-password-token', {token})

  if (response.data.status === "error") {
    notFound()
  }
  
  return (
    <>
      <ResetPasswordForm token={token} />
    </>
  )
}
