import StudentBanner from "@/components/features/dashboard/student/StudentBanner";
import StudentHeader from "@/components/features/dashboard/student/StudentHeader";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <title>Alumnai CPC - Student Profile</title>
        <StudentHeader />
        <main className="lg:max-w-300 md:max-w-200 min-h-screen mx-auto">
            {children}
        </main>
        </>
    )
}