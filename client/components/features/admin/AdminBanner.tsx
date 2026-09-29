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
    <section>
      <AdminWelcomeHeader />
      <AdminStatCards data={statsData} />
    </section>
  )
}

export default AdminBanner
