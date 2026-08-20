import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Handshake } from "lucide-react"
import YourMentees from "./YourMentees"
import YourCollaborations from "./YourCollaborations"
import ManageMentorships from "./ManageMentorships"
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
          <YourMentees mentees={myMentees || []} />
        </TabsContent>

        <TabsContent
          value="your-collaborations"
          className="mt-4 bg-transparent"
        >
          <YourCollaborations collaborations={myCollaborations || []} />
        </TabsContent>

        <TabsContent value="manage-mentorships" className="mt-4 bg-transparent">
          <ManageMentorships requests={myMentorshipRequests || []} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DashboardPanel
