import StudentBanner from "@/components/features/student/dashboard/StudentBanner";
import type { ReactNode } from "react";

export default function StudentDashboardSubLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <StudentBanner />
            {children}
        </>
    );
}
