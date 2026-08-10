import AlumniBanner from "@/components/features/alumni/dashboard/AlumniBanner";
import type { ReactNode } from "react";

export default function AlumniDashboardSubLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <AlumniBanner />
            {children}
        </>
    );
}
