"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users } from "lucide-react"
import YourMentees from "./YourMentees"
import YourCollaborations from "./YourCollaborations"
import ManageMentorships from "./ManageMentorships"

const DashboardPanel = () => {
  return (
    <section className="mt-10">
      <Tabs defaultValue="your-mentees" className="w-full">
        <TabsList variant="none" className="flex justify-between w-full">
          <TabsTrigger value="your-mentees">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentees</span>
            <span className="sm:hidden text-xs">Mentees</span>
          </TabsTrigger>

          <TabsTrigger value="your-collaborations">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Collaborations</span>
            <span className="sm:hidden text-xs">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger value="manage-mentorships">
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Manage Mentorships</span>
            <span className="sm:hidden text-xs">Mentorships</span>
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