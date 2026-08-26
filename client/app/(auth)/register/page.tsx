import RegisterForm from "@/components/features/auth/RegisterForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Create an AlumnAI account to start connecting with mentors, receiving AI skill gap analysis, and building your professional network.",
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
