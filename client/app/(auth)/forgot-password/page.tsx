import ResetPasswordRequestForm from "@/components/features/auth/ResetPasswordRequestForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link to regain access to your AlumnAI account.",
}

export default function ForgotPasswordPage() {
  return (
    <>
      <ResetPasswordRequestForm />
    </>
  )
}
