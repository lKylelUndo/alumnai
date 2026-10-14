import type { Metadata } from "next";
import AdminHeader from "@/components/features/admin/AdminHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import RefreshToasts from "@/components/common/layout/RefreshToasts";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Alumnai CPC - Admin Dashboard",
  description: "Admin dashboard for managing users.",
}

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode={"ADMIN"}>
      <header className="bg-card px-4 py-1 shadow print:hidden sm:px-6">
        <AdminHeader />
      </header>
      <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-6 space-y-6">
        {children}
        <footer className="text-center text-xs text-muted-foreground print:hidden">
          <p>Copyright &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">Cordova Public College</span> &middot; College of Computer Studies. <span className="font-semibold text-foreground">alumnAI</span>. All rights reserved.</p>
        </footer>
      </main>
      <RefreshToasts event="admin:refresh" />
    </AuthGuard>
  )
}