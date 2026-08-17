import LoginForm from "@/components/features/auth/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AlumnAI account to connect with alumni, find mentors, and analyze skill gaps.",
}

export default function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  )
}
