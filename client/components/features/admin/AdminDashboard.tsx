import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Award, GraduationCap, Users, BarChart3 } from "lucide-react"
import VerifyStudents from "./VerifyStudents"
import TopMentors from "./TopMentors"
import AlumniRequest from "./AlumniRequest"
import UserManagement from "./UserManagement"
import Analytics from "./Analytics"
import { adminService } from "@/services/admin.service"

const DashboardPanel = async () => {
  let unverifiedUsers: any = null
  let topMentors: any = null
  let alumniRequest: any = null
  let allUsers: any = null

  try {
    const results = await Promise.allSettled([
      adminService.getUnverifiedUsers(),
      adminService.getTopMentors(),
      adminService.getAlumniRequest(),
      adminService.getAllUsers(),
    ])

    if (results[0].status === "fulfilled") unverifiedUsers = results[0].value
    if (results[1].status === "fulfilled") topMentors = results[1].value
    if (results[2].status === "fulfilled") alumniRequest = results[2].value
    if (results[3].status === "fulfilled") allUsers = results[3].value
  } catch (error) {
    console.error("Failed to load admin dashboard panel data:", error)
  }

  return (
    <section className="mt-6">
      <Tabs defaultValue="verify-students" className="w-full bg-transparent">
        <TabsList
          variant="none"
          className="w-full"
        >
          <TabsTrigger
            value="verify-students"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <UserCheck className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Verify Students</span>
            <span className="text-xs sm:hidden">Verify</span>
          </TabsTrigger>

          <TabsTrigger
            value="top-mentors"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <Award className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Top Mentors</span>
            <span className="text-xs sm:hidden">Mentors</span>
          </TabsTrigger>

          <TabsTrigger
            value="alumni-request"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Alumni Request</span>
            <span className="text-xs sm:hidden">Alumni</span>
          </TabsTrigger>

          <TabsTrigger
            value="manage-users"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Manage Users</span>
            <span className="text-xs sm:hidden">Users</span>
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="text-xs sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verify-students" forceMount className="mt-4 data-[state=inactive]:hidden">
          <VerifyStudents data={unverifiedUsers?.data?.users ?? []} />
        </TabsContent>

        <TabsContent value="top-mentors" forceMount className="mt-4 data-[state=inactive]:hidden">
          <TopMentors data={topMentors?.data?.mentors ?? []} />
        </TabsContent>

        <TabsContent value="alumni-request" forceMount className="mt-4 data-[state=inactive]:hidden">
          <AlumniRequest data={alumniRequest?.data?.requests ?? []} />
        </TabsContent>

        <TabsContent value="manage-users" forceMount className="mt-4 data-[state=inactive]:hidden">
          <UserManagement data={allUsers?.data?.users ?? []} />
        </TabsContent>
        
        <TabsContent value="analytics" forceMount className="mt-4 data-[state=inactive]:hidden">
          {/* Loads on its own so slow AI analytics never blocks the other tabs */}
          <Analytics />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
