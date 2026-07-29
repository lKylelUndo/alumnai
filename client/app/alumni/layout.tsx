import type { Metadata } from "next";
import AlumniHeader from "@/components/features/alumni/dashboard/AlumniHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AlumnAI - Alumni Dashboard",
  description: "Alumni dashboard contains all your alumni information.",
}

export default function AlumniDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="ALUMNI"> 
      <header className="bg-card px-6 py-3 shadow">
        <AlumniHeader />
      </header>
      <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-6 space-y-6">
        {children}
        <footer className="text-primary text-center text-xs">
          <p>Copyright © {new Date().getFullYear()} <span className="font-bold">alumnAI</span>. All rights reserved.</p>
        </footer>
      </main>   
    </AuthGuard>
  )
}