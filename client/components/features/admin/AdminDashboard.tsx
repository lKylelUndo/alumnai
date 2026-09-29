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

  const unverifiedCount = unverifiedUsers?.data?.users?.length ?? 0
  const alumniRequestCount = alumniRequest?.data?.requests?.length ?? 0

  return (
    <section className="mt-6 lg:min-h-screen">
      <Tabs defaultValue="verify-students" className="w-full bg-transparent">
        <TabsList
          variant="none"
          aria-label="Admin dashboard sections"
          className="grid h-auto w-full auto-rows-fr grid-cols-3 gap-1 group-data-horizontal/tabs:h-auto sm:inline-flex sm:group-data-horizontal/tabs:h-8"
        >
          <TabsTrigger
            value="verify-students"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <UserCheck className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Verify Students</span>
            <span className="truncate text-xs sm:hidden">Verify</span>
            {unverifiedCount > 0 && (
              <span
                aria-label={`${unverifiedCount} students awaiting verification`}
                className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-white"
              >
                {unverifiedCount}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="top-mentors"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Award className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Top Mentors</span>
            <span className="truncate text-xs sm:hidden">Mentors</span>
          </TabsTrigger>

          <TabsTrigger
            value="alumni-request"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Alumni Request</span>
            <span className="truncate text-xs sm:hidden">Alumni</span>
            {alumniRequestCount > 0 && (
              <span
                aria-label={`${alumniRequestCount} pending alumni requests`}
                className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-white"
              >
                {alumniRequestCount}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="manage-users"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Manage Users</span>
            <span className="truncate text-xs sm:hidden">Users</span>
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Analytics</span>
            <span className="truncate text-xs sm:hidden">Analytics</span>
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
