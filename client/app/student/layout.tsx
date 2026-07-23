import type { Metadata } from "next";
import StudentHeader from "@/components/features/student/dashboard/StudentHeader";

export const metadata: Metadata = {
  title: "AlumnAI - Student Dashboard",
  description: "Student dashboard containing student info.",
}


export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
         <header className="bg-card px-6 py-3 shadow">
              <StudentHeader />
         </header>
        <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-6 space-y-6">
            {children}
            <footer className="mt-12 py-6 text-primary text-center text-xs">
                <p> © {new Date().getFullYear()} <span className="font-bold">alumnAI</span>. All rights reserved.</p>
            </footer>
        </main>
        </>
    )
}
