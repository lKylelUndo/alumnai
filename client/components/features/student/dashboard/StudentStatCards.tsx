"use client"

import { useState, useEffect, useCallback } from "react"
import DashboardQuickAction from "@/components/common/layout/DashboardQuickAction"
import { Handshake, Mail, Users } from "lucide-react"
import { studentService } from "@/services/student.service"

interface StudentDashboardStats {
  activeCollaborators?: number;
  pendingInvites?: number;
  pendingRequests?: number;
  activeMentorships?: number;
}

const stats = [
  {
    key: "collaborators" as const,
    label: "Active Collaborators",
    sublabel: "Users",
    icon: Handshake,
    bannerBg: "bg-primary/10",
    count: (s: StudentDashboardStats) => s?.activeCollaborators || 0,
  },
  {
    key: "invites" as const,
    label: "Pending Invites",
    sublabel: "Invites",
    icon: Mail,
    bannerBg: "bg-primary/15",
    count: (s: StudentDashboardStats) => s?.pendingInvites ?? s?.pendingRequests ?? 0,
  },
  {
    key: "mentorships" as const,
    label: "Active Mentorships",
    sublabel: "Mentors",
    icon: Users,
    bannerBg: "bg-primary/8",
    count: (s: StudentDashboardStats) => s?.activeMentorships || 0,
  },
]

const StudentStatCards = ({ dashboardStats: initialStats }: { dashboardStats: StudentDashboardStats | null }) => {
  const [dashboardStats, setDashboardStats] = useState<StudentDashboardStats | null>(initialStats)
  const [prevInitialStats, setPrevInitialStats] = useState(initialStats)

  const refetchStats = useCallback(() => {
    studentService.getDashboardStats()
      .then((res) => {
        if (res?.data) setDashboardStats(res.data)
      })
      .catch((err) => console.error("Refetch student stats failed:", err))
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
        profileRoute="/student/profile"
        updateProfileRoute="/student/profile/update"
        featureRoute="/student/find-mentors"
        featureLabel="Find Mentors"
      />
    </section>
  )
}

export default StudentStatCards
