import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Award, GraduationCap, Users, BarChart3 } from "lucide-react"
import VerifyStudents from "./VerifyStudents"
import TopMentors from "./TopMentors"
import AlumniRequest from "./AlumniRequest"
import UserManagement from "./UserManagement"
import Analytics from "./Analytics"

const DashboardPanel = () => {
  return (
    <section className="mt-6">
      <Tabs defaultValue="verify-students" className="w-full bg-transparent">
        <TabsList
          variant="none"
          className="flex w-full items-center justify-between bg-[#eaf5f6] dark:bg-muted p-1.5 rounded-2xl h-auto gap-1 border-none shadow-none"
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
            <span className="hidden sm:inline">Manager Users</span>
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

        <TabsContent value="verify-students" className="mt-4 bg-transparent">
          <VerifyStudents />
        </TabsContent>

        <TabsContent value="top-mentors" className="mt-4 bg-transparent">
          <TopMentors />
        </TabsContent>

        <TabsContent value="alumni-request" className="mt-4 bg-transparent">
          <AlumniRequest />
        </TabsContent>

        <TabsContent value="manage-users" className="mt-4 bg-transparent">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 bg-transparent">
          <Analytics />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
