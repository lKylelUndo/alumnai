import Image from "next/image"
import AdminStatCards from "./AdminStatCards"
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
    <section className="mt-2">
      <div className="flex items-center gap-x-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 p-2 border border-primary/10 shadow-xs">
          <Image
            src="/images/admindashboardicon.png"
            alt="Admin dashboard icon"
            width={60}
            height={60}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary lg:text-3xl">
            Administrative Dashboard
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Monitor platform activity and manage institutional data
          </p>
        </div>
      </div>

      <AdminStatCards data={statsData} />
    </section>
  )
}

export default AdminBanner

