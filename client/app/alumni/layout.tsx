import type { Metadata } from "next";
import AlumniHeader from "@/components/features/alumni/AlumniHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Alumnai CPC - Alumni Dashboard",
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
        <footer className="mt-12 py-6 text-primary text-center text-xs font-medium">
          <p>Copyright © {new Date().getFullYear()} Alumnai. All rights reserved.</p>
        </footer>
      </main>   
    </AuthGuard>
  )
}