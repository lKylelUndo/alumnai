"use client"

import { useState, useEffect, useCallback } from "react"
import DashboardQuickAction from "@/components/common/layout/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"
import { alumniService } from "@/services/alumni.service"

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
    bannerBg: "bg-primary/10",
    count: (s: DashboardStats) => s?.activeCollaborators || 0,
  },
  {
    key: "requests" as const,
    label: "Pending Requests",
    sublabel: "Requests",
    icon: Mail,
    bannerBg: "bg-primary/15",
    count: (s: DashboardStats) => s?.pendingRequests || 0,
  },
  {
    key: "mentorships" as const,
    label: "Active Mentorships",
    sublabel: "Mentees",
    icon: Users,
    bannerBg: "bg-primary/8",
    count: (s: DashboardStats) => s?.activeMentorships || 0,
  },
]

const AlumniStatCards = ({ dashboardStats: initialStats }: { dashboardStats: DashboardStats | null }) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(initialStats)
  const [prevInitialStats, setPrevInitialStats] = useState(initialStats)

  const refetchStats = useCallback(() => {
    alumniService.getDashboardStats()
      .then((res) => {
        if (res?.data) setDashboardStats(res.data)
      })
      .catch((err) => console.error("Refetch alumni stats failed:", err))
  }, [])

  if (prevInitialStats !== initialStats) {
    setPrevInitialStats(initialStats)
    if (initialStats) setDashboardStats(initialStats)
  }

  useEffect(() => {
    if (!dashboardStats) refetchStats()
  }, [dashboardStats, refetchStats])

  return (
    <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="group rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
          >
            <div className={`${stat.bannerBg} px-5 py-4`}>
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{stat.label}</span>
              </div>
            </div>
            <div className="px-5 py-4">
              <span className="text-4xl font-extrabold text-foreground block">
                {stat.count(dashboardStats!)}
              </span>
              <span className="text-xs text-muted-foreground mt-1 block">{stat.sublabel}</span>
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
