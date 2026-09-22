import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Target, Mail, Handshake } from "lucide-react"
import SkillGapAnalysis from "@/components/features/student/dashboard/SkillGapAnalysis"
import CollaborationInvites from "./CollaborationInvites"
import Collaborators from "./Collaborators"
import Mentors from "./Mentors"
import { mentorshipService } from "@/services/mentorship.service"
import { collaborationService } from "@/services/collaboration.service"
import { StudentMentorCardTypes } from "@/lib/types/mentorship"
import { StudentCollaboratorCardTypes, StudentCollabInviteCardTypes } from "@/lib/types/collaboration"

const DashboardPanel = async () => {
  let myCollaborationInvites: StudentCollabInviteCardTypes[] = []
  let myMentors: StudentMentorCardTypes[] = []
  let myCollaborators: StudentCollaboratorCardTypes[] = []

  try {
    const results = await Promise.allSettled([
      collaborationService.getCollabRequests(),
      mentorshipService.getMyMentors(),
      collaborationService.getMyStudentCollaborations(),
    ])

    if (results[0].status === "fulfilled") myCollaborationInvites = results[0].value?.data || []
    if (results[1].status === "fulfilled") myMentors = results[1].value?.data || []
    if (results[2].status === "fulfilled") myCollaborators = results[2].value?.data || []
  } catch (error) {
    console.error("Failed to load student dashboard panel data:", error)
  }

  return (
    <section className="mt-6 min-h-screen">
        <Tabs defaultValue="gap-analysis" className="w-full bg-transparent">
        <TabsList variant="none" className="w-full">
          <TabsTrigger
            value="gap-analysis"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Target className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Gap Analysis</span>
            <span className="text-xs sm:hidden">Analysis</span>
          </TabsTrigger>

          <TabsTrigger
            value="collaboration-invites"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Mail className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Collaboration Requests</span>
            <span className="text-xs sm:hidden">Requests</span>
          </TabsTrigger>

          <TabsTrigger
            value="my-mentors"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Mentors</span>
            <span className="text-xs sm:hidden">Mentors</span>
          </TabsTrigger>

          <TabsTrigger
            value="my-collaborators"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Handshake className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Your Collaborators</span>
            <span className="text-xs sm:hidden">Collaborators</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gap-analysis" forceMount className="mt-6 data-[state=inactive]:hidden">
          <SkillGapAnalysis />
        </TabsContent>

        <TabsContent value="collaboration-invites" forceMount className="mt-6 data-[state=inactive]:hidden">
          <CollaborationInvites invites={myCollaborationInvites || []} />
        </TabsContent>

        <TabsContent value="my-mentors" forceMount className="mt-6 data-[state=inactive]:hidden">
          <Mentors mentors={myMentors || []} />
        </TabsContent>

        <TabsContent value="my-collaborators" forceMount className="mt-6 data-[state=inactive]:hidden">
          <Collaborators collaborators={myCollaborators || []} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
