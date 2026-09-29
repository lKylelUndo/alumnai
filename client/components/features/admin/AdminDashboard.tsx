import { AdminTabs } from "./AdminTabs"
import { adminService } from "@/services/admin.service"
import type { VerifyStudents } from "./VerifyStudents"
import type { TopMentors } from "@/lib/types/mentorship"
import type { AlumniRequest } from "@/lib/types/alumni"
import type { UserManagement } from "./UserManagement"

const DashboardPanel = async () => {
  let unverifiedUsers: VerifyStudents[] = []
  let topMentors: TopMentors[] = []
  let alumniRequest: AlumniRequest[] = []
  let allUsers: UserManagement[] = []

  try {
    const results = await Promise.allSettled([
      adminService.getUnverifiedUsers(),
      adminService.getTopMentors(),
      adminService.getAlumniRequest(),
      adminService.getAllUsers(),
    ])

    if (results[0].status === "fulfilled")
      unverifiedUsers = results[0].value.data?.users ?? []
    if (results[1].status === "fulfilled")
      topMentors = results[1].value.data?.mentors ?? []
    if (results[2].status === "fulfilled")
      alumniRequest = results[2].value.data?.requests ?? []
    if (results[3].status === "fulfilled")
      allUsers = results[3].value.data?.users ?? []
  } catch (error) {
    console.error("Failed to load admin dashboard panel data:", error)
  }

  return (
    <section className="mt-6 lg:min-h-screen">
      <AdminTabs
        unverifiedUsers={unverifiedUsers}
        topMentors={topMentors}
        alumniRequests={alumniRequest}
        allUsers={allUsers}
      />
    </section>
  )
}

export default DashboardPanel
