import DashboardQuickAction from "@/components/common/layout/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"

interface DashboardStats {
  activeCollaborators: number
  activeMentorships: number 
  pendingRequests: number 
}

const AlumniStatCards = ({ dashboardStats } : {dashboardStats: DashboardStats | null}) => {
  console.log("dashboardStats", dashboardStats)
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
        {/* Active Collaborators */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-105 dark:bg-blue-950/40 dark:text-blue-400">
              <Handshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Active Collaborators
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">{dashboardStats?.activeCollaborators || 0}</span>
                <span className="text-xs text-muted-foreground">Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-105 dark:bg-amber-950/40 dark:text-amber-400">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Pending Requests
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">{dashboardStats?.pendingRequests || 0}</span>
                <span className="text-xs text-muted-foreground">Requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Mentorships */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-105 dark:bg-purple-950/40 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Active Mentorships
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">{dashboardStats?.activeMentorships || 0}</span>
                <span className="text-xs text-muted-foreground">Mentees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <DashboardQuickAction
        profileRoute="/alumni/profile"
        updateProfileRoute="/alumni/profile/update"
        featureRoute="/alumni/find-collaborators"
        featureLabel="Find Collaborators"
      />
    </section>
  )
}

export default AlumniStatCards
