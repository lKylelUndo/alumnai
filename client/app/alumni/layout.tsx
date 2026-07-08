import type { Metadata } from "next";
import AlumniBanner from "@/components/features/alumni/AlumniBanner";
import AlumniHeader from "@/components/features/alumni/AlumniHeader";

export const metadata: Metadata = {
    title: "Alumnai CPC - Alumni Dashboard",
    description: "Alumni dashboard contains all your alumni information.",
}

export default function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
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