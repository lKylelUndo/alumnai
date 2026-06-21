"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import YourMentees from "./YourMentees"
import YourCollaborations from "./YourCollaborations"
import ManageMentorships from "./ManageMentorships"
import { TrendingUp, Users } from "lucide-react"
const DashboardPanel = () => {
  return (
    <section className="mt-8 px-4 md:px-0">
      <Tabs defaultValue="your-mentees" className="w-full">
        <TabsList
          variant="none"
          className="grid w-full grid-cols-3 rounded-lg overflow-hidden border border-border p-1 bg-tabs"
        >
          <TabsTrigger
            value="your-mentees"
            className="py-2.5 flex items-center justify-center gap-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md transition-all font-semibold"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentees</span>
            <span className="sm:hidden text-xs">Mentees</span>
          </TabsTrigger>
          <TabsTrigger
            value="your-collaborations"
            className="py-2.5 flex items-center justify-center gap-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md transition-all font-semibold"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Collaborations</span>
            <span className="sm:hidden text-xs">Collaborations</span>
          </TabsTrigger>
          <TabsTrigger
            value="manage-mentorships"
            className="py-2.5 flex items-center justify-center gap-x-2 data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md transition-all font-semibold"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Manage Mentorships</span>
            <span className="sm:hidden text-xs">Mentorships</span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-6 border border-border rounded-xl bg-card p-6 shadow-xs">
          <TabsContent value="your-mentees" className="bg-transparent p-0 outline-none">
            <YourMentees />
          </TabsContent>
          <TabsContent value="your-collaborations" className="bg-transparent p-0 outline-none">
            <YourCollaborations />
          </TabsContent>
          <TabsContent value="manage-mentorships" className="bg-transparent p-0 outline-none">
            <ManageMentorships />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}
export default DashboardPanel
