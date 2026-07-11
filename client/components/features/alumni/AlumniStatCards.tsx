import DashboardQuickAction from "@/components/common/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"

const AlumniStatCards = () => {
  return (
    <section className="mt-6 grid grid-cols-1 gap-6 px-4 md:p-0 md:px-0 lg:grid-cols-4">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
        {/* Active Collaborators */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-sm">
          <div className="space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              <Handshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Active Collaborators
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">7</span>
                <span className="text-sm text-muted-foreground">Users</span>
              </div>
            </div>
          </div>
        </div>
        {/* Pending Requests */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-sm">
          <div className="space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Pending Requests
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">2</span>
                <span className="text-sm text-muted-foreground">Requests</span>
              </div>
            </div>
          </div>
        </div>
        {/* Active Mentorships */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-sm">
          <div className="space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Active Mentorships
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">12</span>
                <span className="text-sm text-muted-foreground">Mentees</span>
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
      />
    </section>
  )
}
export default AlumniStatCards
