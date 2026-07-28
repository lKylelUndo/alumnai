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
          variant="none"
          className="flex w-full items-center justify-between bg-[#eaf5f6] dark:bg-muted p-1.5 rounded-2xl h-auto gap-1 border-none shadow-none"
        >
          <TabsTrigger
            value="your-mentees"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentees</span>
            <span className="sm:hidden text-xs">Mentees</span>
          </TabsTrigger>

          <TabsTrigger
            value="your-collaborations"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <Handshake className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Collaborations</span>
            <span className="sm:hidden text-xs">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger
            value="manage-mentorships"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Manage Mentorships</span>
            <span className="sm:hidden text-xs">Mentorships</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your-mentees" className="mt-4 bg-transparent">
          <YourMentees />
        </TabsContent>

        <TabsContent value="your-collaborations" className="mt-4 bg-transparent">
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