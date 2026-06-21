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
      <Tabs defaultValue="verify-students" className="w-full">
        <TabsList variant="none" className="flex w-full justify-between">
          <TabsTrigger value="verify-students">
            <UserCheck className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Verify Students</span>
            <span className="text-xs sm:hidden">Verify</span>
          </TabsTrigger>

          <TabsTrigger value="top-mentors">
            <Award className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Top Mentors</span>
            <span className="text-xs sm:hidden">Mentors</span>
          </TabsTrigger>

          <TabsTrigger value="alumni-request">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Alumni Request</span>
            <span className="text-xs sm:hidden">Alumni</span>
          </TabsTrigger>

          <TabsTrigger value="manage-users">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Manage Users</span>
            <span className="text-xs sm:hidden">Users</span>
          </TabsTrigger>

          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="text-xs sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verify-students">
          <VerifyStudents />
        </TabsContent>

        <TabsContent value="top-mentors">
          <TopMentors />
        </TabsContent>

        <TabsContent value="alumni-request">
          <AlumniRequest />
        </TabsContent>

        <TabsContent value="manage-users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
