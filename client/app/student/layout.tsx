import type { Metadata } from "next";
import dynamic from "next/dynamic";
import StudentHeader from "@/components/features/student/dashboard/StudentHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import ChatBox from "@/components/common/ChatBoxDynamic";

export const metadata: Metadata = {
  title: "AlumnAI - Student Dashboard",
  description: "Student dashboard containing student info.",
}


export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard mode="STUDENT">
            <header className="border-b border-border bg-card px-6 py-3">
                <StudentHeader />
            </header>
            <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-6 space-y-6">
                {children}
                <footer className="text-primary text-center text-xs">
                    <p> © {new Date().getFullYear()} <span className="font-bold">alumnAI</span>. All rights reserved.</p>
                </footer>
            </main>
            <ChatBox />
        </AuthGuard>
    )
}
