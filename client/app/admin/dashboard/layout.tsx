import AdminBanner from "@/components/features/admin/AdminBanner"
import { ReactNode } from "react"

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminBanner />
      {children}
    </>
  )
}
