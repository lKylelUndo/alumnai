"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users } from "lucide-react"
import YourMentees from "@/components/features/alumni/dashboard/YourMentees"
import YourCollaborations from "@/components/features/alumni/dashboard/YourCollaborations"
import ManageMentorships from "@/components/features/alumni/dashboard/ManageMentorships"

const DashboardPanel = () => {
  return (
    <section className="mt-6 min-h-screen">
      <Tabs defaultValue="your-mentees" className="w-full bg-transparent">
        <TabsList variant="none" className="flex justify-between w-full">

          <TabsTrigger value="gap-analysis"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Gap Analysis</span>
            <span className="sm:hidden text-xs">Analysis</span>
          </TabsTrigger>  

          <TabsTrigger value="your-collaborations"
             className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Collaboration Invites</span>
            <span className="sm:hidden text-xs">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger value="your-mentees"
             className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentors</span>
            <span className="sm:hidden text-xs">Mentors</span>
          </TabsTrigger>

          <TabsTrigger value="manage-mentorships"
             className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-xs">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">My Collaborators</span>
            <span className="sm:hidden text-xs">Collaborators</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your-mentees">
          <YourMentees />
        </TabsContent>

        <TabsContent value="your-collaborations">
          <YourCollaborations />
        </TabsContent>

        <TabsContent value="manage-mentorships">
          <ManageMentorships />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel