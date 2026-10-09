import ResetPasswordForm from "@/components/features/auth/ForgetPasswordForm"
import { authService } from "@/services/auth.service"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your new password to restore access to your AlumnAI account.",
}

export default async function ResetPasswordPage({ params}: { params: Promise<{ token: string }>}) {
  const { token } = await params

  try {
    const response = await authService.verifyResetPasswordToken({token})

    if (response?.status === "error") {
      notFound()
    }
  } catch {
    notFound()
  }
  
  return (
    <>
      <ResetPasswordForm token={token} />
    </>
  )
}
