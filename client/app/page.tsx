import Header from "@/components/common/layout/Header"
import Footer from "@/components/common/layout/Footer"
import LandingPage from "@/components/features/home/LandingPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AlumnAI — Where Verified Skill Data Meets Real Mentorship",
  description:
    "AlumnAI connects CPC computing students and alumni through AI-powered, evidence-based skill profiles built from GitHub activity.",
  alternates: {
    canonical: "/",
  },
}

export const revalidate = 3600

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
