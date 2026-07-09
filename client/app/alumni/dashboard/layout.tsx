import AlumniBanner from "@/components/features/alumni/AlumniBanner";
import type { ReactNode } from "react";

export default function AlumniDashboardSubLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <AlumniBanner />
            {children}
        </>
    );
}
