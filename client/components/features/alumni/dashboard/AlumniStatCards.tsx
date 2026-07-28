import DashboardQuickAction from "@/components/common/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"

const AlumniStatCards = () => {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
        {/* Active Collaborators */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Handshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Active Collaborators
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">7</span>
                <span className="text-xs text-muted-foreground">Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Pending Requests
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">2</span>
                <span className="text-xs text-muted-foreground">Requests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Mentorships */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Active Mentorships
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-3xl font-bold text-foreground">12</span>
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
