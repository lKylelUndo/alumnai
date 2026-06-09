import ResetPasswordForm from "@/components/features/auth/ForgetPasswordForm"
import axiosInstance from "@/lib/axios"
import { notFound } from "next/navigation"

export default async function ResetPasswordPage({ params}: { params: Promise<{ token: string }>}) {
  const { token } = await params

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/v1/verify-reset-password-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    credentials: "include",
  })

  const data = await response.json()

  if (!response.ok || data.status === "error") {
    notFound()
  }
  
  return (
    <>
      <ResetPasswordForm token={token} />
    </>
  )
}
