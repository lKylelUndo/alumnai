import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VerifyStudents from "./VerifyStudents"
import TopMentors from "./TopMentors"
import AlumniRequest from "./AlumniRequest"
import UserManagement from "./UserManagement"
import Analytics from "./Analytics"

const DashboardPanel = () => {
  return (
    <section className="mt-6">
      <Tabs defaultValue="verify-students">
        <TabsList variant="none" className="flex w-full justify-center">
          <TabsTrigger value="verify-students">Verify Students</TabsTrigger>
          <TabsTrigger value="top-mentors">Top Mentors</TabsTrigger>
          <TabsTrigger value="alumni-request">Alumni Request</TabsTrigger>
          <TabsTrigger value="manage-users">Manage Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
