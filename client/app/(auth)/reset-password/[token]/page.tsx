import ResetPasswordForm from "@/components/features/auth/ForgetPasswordForm"
import { axiosInstance } from "@/lib/axios"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your new password to restore access to your AlumnAI account.",
}

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
