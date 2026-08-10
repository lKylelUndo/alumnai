import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Handshake } from "lucide-react"
import YourMentees from "./YourMentees"
import YourCollaborations from "./YourCollaborations"
import ManageMentorships from "./ManageMentorships"

const DashboardPanel = () => {
  return (
    <section className="mt-6 min-h-screen">
      <Tabs defaultValue="your-mentees" className="w-full bg-transparent">
        <TabsList
          className="flex h-auto w-full items-center justify-between gap-1 rounded-2xl border-none bg-[#eaf5f6] p-1.5 shadow-none dark:bg-muted"
        >
          <TabsTrigger
            value="your-mentees"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentees</span>
            <span className="text-xs sm:hidden">Mentees</span>
          </TabsTrigger>

          <TabsTrigger
            value="your-collaborations"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Handshake className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Collaborations</span>
            <span className="text-xs sm:hidden">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger
            value="manage-mentorships"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Manage Mentorships</span>
            <span className="text-xs sm:hidden">Mentorships</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your-mentees" className="mt-4 bg-transparent">
          <YourMentees />
        </TabsContent>

        <TabsContent
          value="your-collaborations"
          className="mt-4 bg-transparent"
        >
          <YourCollaborations />
        </TabsContent>

        <TabsContent value="manage-mentorships" className="mt-4 bg-transparent">
          <ManageMentorships />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
