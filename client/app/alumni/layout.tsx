import AlumniBanner from "@/components/features/dashboard/alumni/AlumniBanner";
import AlumniHeader from "@/components/features/dashboard/alumni/AlumniHeader";

export default function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <title>Alumnai CPC - Alumni Dashboard</title>
        <header className="lg:max-w-300 md:max-w-200 mx-auto">
            <AlumniHeader />
        </header>
        <main className="lg:max-w-300 md:max-w-200 min-h-screen mx-auto">
            <AlumniBanner />
            {children}
        </main>
        </>
    )
}