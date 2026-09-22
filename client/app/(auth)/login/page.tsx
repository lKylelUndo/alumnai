import LoginForm from "@/components/features/auth/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AlumnAI account to connect with verified alumni mentors and build your skill profile.",
  alternates: {
    canonical: "/login",
  },
}

export default function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  )
}
