import StudentHeader from "@/components/features/student/dashboard/StudentHeader";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <title>Alumnai CPC - Student Dashboard</title>
         <header className="px-2">
              <StudentHeader />
         </header>
        <main className="lg:max-w-300 md:max-w-200 min-h-screen mx-auto">
            {children}
            <footer className="text-primary text-center border border-white text-sm p-4">
                <p> © {new Date().getFullYear()}  Alumnai. All rights reserved.</p>
            </footer>
        </main>
        </>
    )
}