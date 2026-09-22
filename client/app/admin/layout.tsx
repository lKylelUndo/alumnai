import type { Metadata } from "next";
import dynamic from "next/dynamic";
import AdminHeader from "@/components/features/admin/AdminHeader";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import ChatBox from "@/components/common/ChatBoxDynamic";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Alumnai CPC - Admin Dashboard",
  description: "Admin dashboard for managing users.",
}

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode={"ADMIN"}>
      <header className="bg-card px-6 py-3 shadow">
        <AdminHeader />
      </header>
      <main className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 py-6 space-y-6">
        {children}
        <footer className="mt-12 py-6 text-primary text-center text-xs font-medium">
          <p>Copyright © {new Date().getFullYear()} Alumnai. All rights reserved.</p>
        </footer>
      </main>
      <ChatBox />
    </AuthGuard>
  )
}