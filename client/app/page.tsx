import Header from "@/components/common/layout/Header"
import Footer from "@/components/common/layout/Footer"
import LandingPage from "@/components/features/home/LandingPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AlumnAI - AI-Powered CPC Alumni-Student Matching And Skill Gap Analysis System",
  description: "Empowering students and alumni through AI-powered mentorship matching, skill gap analysis, and career growth opportunities.",
  alternates: {
    canonical: "/",
  },
}

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <LandingPage />
      </main>
      <Footer />
    </>
  )
}
