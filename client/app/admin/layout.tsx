import AdminBanner from "@/components/features/admin/AdminBanner";
import AdminHeader from "@/components/features/admin/AdminHeader";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <title>Alumnai CPC - Admin Dashboard</title>
        <header className="lg:max-w-300 md:max-w-200 mx-auto">
            <AdminHeader />
        </header>
        <main className="lg:max-w-300 md:max-w-200 min-h-screen mx-auto">
            <AdminBanner />
            {children}
        </main>
    </>
  )
}