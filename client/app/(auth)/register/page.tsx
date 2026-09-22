import RegisterForm from "@/components/features/auth/RegisterForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Create your verified AlumnAI skill profile and connect with CPC alumni mentors powered by AI.",
  alternates: {
    canonical: "/register",
  },
}

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
    </>
  )
}
