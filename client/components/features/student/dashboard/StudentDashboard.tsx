import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Target } from "lucide-react"
import SkillGapAnalysis from "@/components/features/student/dashboard/SkillGapAnalysis"
import CollaborationInvites from "./CollaborationInvites"
import Collaborators from "./Collaborators"
import Mentors from "./Mentors"
import { studentService } from "@/services/student.service"

const DashboardPanel = async () => {
  // let myCollaborationInvites: any = null
  // let myMentors: any = null
  // let myCollaborators: any = null

  // try {
  //   const results = await Promise.allSettled([
  //     studentService.getMyCollaborationInvites(),
  //     studentService.getMyMentors(),
  //     studentService.getMyCollaborators(),
  //   ])

  //   if(results[0].status === "fulfilled") myCollaborationInvites = results[0].value
  //   if(results[1].status === "fulfilled") myMentors = results[1].value
  //   if(results[2].status === "fulfilled") myCollaborators = results[2].value
  // } catch (error) {
  //   console.error("Failed to load admin dashboard panel data:", error)
  // }

  // console.log("Student collaboration invites:",myCollaborationInvites)
  // console.log("Student mentors:",myMentors)
  // console.log("Student collaborators:",myCollaborators)
  
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
            value="collaboration-invites"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Collaboration Invites</span>
            <span className="text-xs sm:hidden">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger
            value="my-mentors"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Mentors</span>
            <span className="text-xs sm:hidden">Mentors</span>
          </TabsTrigger>

          <TabsTrigger
            value="my-collaborators"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Collaborators</span>
            <span className="text-xs sm:hidden">Collaborators</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gap-analysis" className="mt-4">
          <SkillGapAnalysis />
        </TabsContent>

        <TabsContent value="collaboration-invites" className="mt-4">
          <CollaborationInvites />
        </TabsContent>

        <TabsContent value="my-collaborators" className="mt-4">
          <Collaborators />
        </TabsContent>

        <TabsContent value="my-mentors" className="mt-4">
          <Mentors />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
