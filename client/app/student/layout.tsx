import type { Metadata } from "next";
import StudentHeader from "@/components/features/student/dashboard/StudentHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import ChatBox from "@/components/common/ChatBoxDynamic";
import RefreshToasts from "@/components/common/layout/RefreshToasts";

export const metadata: Metadata = {
  title: "AlumnAI - Student Dashboard",
  description: "Student dashboard containing student info.",
}


export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard mode="STUDENT">
            <header className="border-b border-border bg-card px-4 py-1 print:hidden sm:px-6">
                <StudentHeader />
            </header>
            <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-6 space-y-6">
                {children}
                <footer className="text-center text-xs text-muted-foreground print:hidden">
                    <p>Copyright &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">Cordova Public College</span> &middot; College of Computer Studies. <span className="font-semibold text-foreground">alumnAI</span>. All rights reserved.</p>
                </footer>
            </main>
            <ChatBox />
            <RefreshToasts event="student:refresh" />
        </AuthGuard>
    )
}
