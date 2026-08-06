import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Target } from "lucide-react"
import YourMentees from "@/components/features/alumni/dashboard/YourMentees"
import YourCollaborations from "@/components/features/alumni/dashboard/YourCollaborations"
import ManageMentorships from "@/components/features/alumni/dashboard/ManageMentorships"
import SkillGapAnalysis from "@/components/features/student/dashboard/SkillGapAnalysis"

const DashboardPanel = () => {
  return (
    <section className="mt-6 min-h-screen">
      <Tabs defaultValue="gap-analysis" className="w-full bg-transparent">
        <TabsList variant="none" className="flex w-full justify-between">
          <TabsTrigger
            value="gap-analysis"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Target className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Gap Analysis</span>
            <span className="text-xs sm:hidden">Analysis</span>
          </TabsTrigger>

          <TabsTrigger
            value="your-collaborations"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Collaboration Invites</span>
            <span className="text-xs sm:hidden">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger
            value="your-mentees"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentors</span>
            <span className="text-xs sm:hidden">Mentors</span>
          </TabsTrigger>

          <TabsTrigger
            value="manage-mentorships"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">My Collaborators</span>
            <span className="text-xs sm:hidden">Collaborators</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gap-analysis" className="mt-4">
          <SkillGapAnalysis />
        </TabsContent>

        <TabsContent value="your-mentees" className="mt-4">
          <YourMentees />
        </TabsContent>

        <TabsContent value="your-collaborations" className="mt-4">
          <YourCollaborations />
        </TabsContent>

        <TabsContent value="manage-mentorships" className="mt-4">
          <ManageMentorships />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel

