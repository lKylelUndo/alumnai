import AdminStatCards from "./AdminStatCards"
import AdminWelcomeHeader from "./AdminWelcomeHeader"
import { adminService } from "@/services/admin.service"

const AdminBanner = async () => {
  let statsData = null
  try {
    const response = await adminService.getDashboardStats()
    statsData = response?.data
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error
    }
    console.error("Failed to fetch admin stats", error)
  }

  return (
    <section className="rounded-2xl bg-primary/[0.03] p-6">
      <AdminWelcomeHeader />
      <AdminStatCards data={statsData} />
    </section>
  )
}

export default AdminBanner
