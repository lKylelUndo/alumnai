import type { Metadata } from "next";
import AdminBanner from "@/components/features/admin/AdminBanner";
import AdminHeader from "@/components/features/admin/AdminHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Alumnai CPC - Admin Dashboard",
    description: "Admin dashboard for managing users.",
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode={"ADMIN"}>
        <header className="lg:max-w-300 md:max-w-200 mx-auto">
            <AdminHeader />
        </header>
        <main className="lg:max-w-300 md:max-w-200 min-h-screen mx-auto">
            <AdminBanner />
            {children}
            <footer className="text-primary text-center border border-white">
              <p>Copyright © {new Date().getFullYear()}  Alumnai. All rights reserved.</p>
            </footer>
        </main>
    </AuthGuard>
  )
}