import StudentBanner from "@/components/features/dashboard/student/StudentBanner"
import StudentHeader from "@/components/features/dashboard/student/StudentHeader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alumnai CPC - Student Dashboard",
}

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <header>
            <StudentHeader />
        </header>
        <main className="mx-auto min-h-screen md:max-w-200 lg:max-w-300">
            <StudentBanner />
            {children}
        </main>
    </>
  )
}
