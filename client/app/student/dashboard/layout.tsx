<<<<<<< HEAD
import StudentBanner from "@/components/features/student/dashboard/StudentBanner";
import type { ReactNode } from "react";

export default function StudentDashboardSubLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <StudentBanner />
            {children}
        </>
    );
=======
import { Metadata } from "next"
import StudentBanner from "@/components/features/student/StudentBanner";
import StudentHeader from "@/components/features/student/StudentHeader";

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
>>>>>>> b2a76732409201d14775a7159f4ec0b8dfaa2903
}
