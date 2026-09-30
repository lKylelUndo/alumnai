import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Handshake } from "lucide-react"
import YourMentees from "./YourMentees"
import YourCollaborations from "./YourCollaborations"
import ManageMentorships from "./ManageMentorships"
import PendingCountBadge from "@/components/common/layout/PendingCountBadge"
import { alumniService } from "@/services/alumni.service"
import { mentorshipService } from "@/services/mentorship.service"
import { AlumniStudentMentorshipCardTypes } from "@/lib/types/mentorship"
import { AlumniStudentCollaborationCardTypes } from "@/lib/types/collaboration"

const DashboardPanel = async () => {
  let myMentees: AlumniStudentMentorshipCardTypes[] = []
  let myCollaborations: AlumniStudentCollaborationCardTypes[] = []
  let myMentorshipRequests: AlumniStudentMentorshipCardTypes[] = []

  try {
    const results = await Promise.allSettled([
      mentorshipService.getMyMentees(),
      alumniService.getMyCollaborations(),
      mentorshipService.getMentorshipRequests(),
    ])

    if(results[0].status === "fulfilled") myMentees = results[0].value.data
    if(results[1].status === "fulfilled") myCollaborations = results[1].value.data
    if(results[2].status === "fulfilled") myMentorshipRequests = results[2].value.data
  } catch (error) {
    console.error("Failed to load admin dashboard panel data:", error)
  }

  return (
    <section className="mt-6 lg:min-h-screen">
      <Tabs defaultValue="your-mentees" className="w-full bg-transparent">
        <TabsList
          variant="none"
          aria-label="Alumni dashboard sections"
          className="grid h-auto w-full auto-rows-fr grid-cols-3 gap-1 group-data-horizontal/tabs:h-auto sm:inline-flex sm:group-data-horizontal/tabs:h-8"
        >
          <TabsTrigger
            value="your-mentees"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">My Mentees</span>
            <span className="truncate text-xs sm:hidden">Mentees</span>
          </TabsTrigger>

          <TabsTrigger
            value="your-collaborations"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Handshake className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">My Collaborations</span>
            <span className="truncate text-xs sm:hidden">Collaborations</span>
          </TabsTrigger>

          <TabsTrigger
            value="manage-mentorships"
            className="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-xs sm:min-h-0 sm:px-3 sm:text-sm dark:data-[state=active]:bg-card"
          >
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Mentorship Requests</span>
            <span className="truncate text-xs sm:hidden">Requests</span>
            <PendingCountBadge initial={myMentorshipRequests.length} source="mentorship-requests" label="pending mentorship requests" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your-mentees" forceMount className="mt-4 bg-transparent data-[state=inactive]:hidden">
          <YourMentees mentees={myMentees || []} />
        </TabsContent>

        <TabsContent
          value="your-collaborations"
          forceMount
          className="mt-4 bg-transparent data-[state=inactive]:hidden"
        >
          <YourCollaborations collaborations={myCollaborations || []} />
        </TabsContent>

        <TabsContent value="manage-mentorships" forceMount className="mt-4 bg-transparent data-[state=inactive]:hidden">
          <ManageMentorships requests={myMentorshipRequests || []} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
