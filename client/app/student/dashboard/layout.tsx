import StudentBanner from "@/components/features/student/StudentBanner";
import StudentHeader from "@/components/features/student/StudentHeader";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <title>Alumnai CPC - Student Dashboard</title>
        <StudentHeader />
        <main className="lg:max-w-300 md:max-w-200 min-h-screen mx-auto">
            <StudentBanner />
            {children}
        </main>
        </>
    )
}