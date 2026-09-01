import DashboardQuickAction from "@/components/common/layout/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"

interface DashboardStats {
  activeCollaborators: number
  activeMentorships: number
  pendingRequests: number
}

const stats = [
  {
    key: "collaborators" as const,
    label: "Active Collaborators",
    sublabel: "Users",
    icon: Handshake,
    borderColor: "border-t-primary",
    iconBg: "bg-primary/10 text-primary",
    count: (s: DashboardStats) => s?.activeCollaborators || 0,
  },
  {
    key: "requests" as const,
    label: "Pending Requests",
    sublabel: "Requests",
    icon: Mail,
    borderColor: "border-t-primary/40",
    iconBg: "bg-primary/10 text-primary",
    count: (s: DashboardStats) => s?.pendingRequests || 0,
  },
  {
    key: "mentorships" as const,
    label: "Active Mentorships",
    sublabel: "Mentees",
    icon: Users,
    borderColor: "border-t-primary/70",
    iconBg: "bg-primary/10 text-primary",
    count: (s: DashboardStats) => s?.activeMentorships || 0,
  },
]

const AlumniStatCards = ({ dashboardStats }: { dashboardStats: DashboardStats | null }) => {
  return (
    <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className={`group flex flex-col gap-4 rounded-2xl border border-border/80 border-t-[3px] ${stat.borderColor} bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} group-hover:scale-105 transition-transform`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </h2>
              <div className="flex items-baseline gap-x-2">
                <span className="text-4xl font-extrabold text-foreground">{stat.count(dashboardStats!)}</span>
                <span className="text-xs text-muted-foreground">{stat.sublabel}</span>
              </div>
            </div>
          </div>
        ))}
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
