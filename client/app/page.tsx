import Header from "@/components/common/layout/Header"
import Footer from "@/components/common/layout/Footer"
import LandingPage from "@/components/features/home/LandingPage"

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
