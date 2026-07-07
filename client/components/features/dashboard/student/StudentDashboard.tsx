"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users } from "lucide-react"
import YourMentees from "@/components/features/dashboard/alumni/YourMentees"
import YourCollaborations from "@/components/features/dashboard/alumni/YourCollaborations"
import ManageMentorships from "@/components/features/dashboard/alumni/ManageMentorships"

const DashboardPanel = () => {
  return (
    <section className="mt-10">
      <Tabs defaultValue="your-mentees" className="w-full">
        <TabsList variant="none" className="flex justify-between w-full">

          <TabsTrigger value="gap-analysis">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Gap Analysis</span>
            <span className="sm:hidden text-xs">Analysis</span>
          </TabsTrigger>  

          <TabsTrigger value="your-collaborations">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Collaboration Invites</span>
            <span className="sm:hidden text-xs">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger value="your-mentees">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentors</span>
            <span className="sm:hidden text-xs">Mentors</span>
          </TabsTrigger>

          <TabsTrigger value="manage-mentorships">
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